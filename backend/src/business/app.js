require('dotenv').config();
const path = require('path');
const express = require('express');
const url = require('url');
const jwt = require('jsonwebtoken');
const getRawBody = require('raw-body');
const cookieParser = require('cookie-parser');
const { getInstallMiddleware, checkIntegrity } = require('./install');
const getDynamo = require('../persistence/dynamo');
const { registerWebhook, validateWebhook } = require('./webhooks');
const { getTokenAccess } = require('./dataAccess');

const createApp = (frontendPath) => {
  const accessTokensTableName = 'shopify-access-tokens';
  const tokenAccess = getTokenAccess(getDynamo(accessTokensTableName));

  const {
    STAGE,
    SHOPIFY_API_SECRET_KEY,
    SHOPIFY_API_KEY,
    SECRET_KEY,
    HOST,
  } = process.env;

  // TODO NEEDED? NO!
  const prefix = STAGE ? `/${STAGE}` : '';

  const adminUrl = (shop) => `https://${shop}/admin/apps/${SHOPIFY_API_KEY}`;
  const authFailUrl = `${prefix}/fail`;
  const redirectPath = `${prefix}/auth/callback`;
  const authPath = '/auth';
  const authCallbackPath = '/auth/callback';
  const scope = ['read_products'];

  const frontendRoute = 'secure';
  const homePage = 'index.html';

  const onNoAuth = (res) => {
    res.redirect(authFailUrl);
  };

  const onAuth = async (req, res, shop, accessToken) => {
    const putTokenError = tokenAccess.putToken(shop, accessToken);

    if (putTokenError) {
      console.error(`Failed to put accessToken for ${shop}`, putTokenError);
      onNoAuth(res);
    } else {
      const registration = await registerWebhook({
        address: `${HOST}/uninstall`,
        topic: 'APP_UNINSTALLED',
        accessToken,
        shop,
        apiVersion: '2020-10',
      });

      if (!registration.success) {
        console.error('Failed to register webhook', registration.result);
      }

      res.redirect(adminUrl(shop));
    }
  };

  const installAuth = getInstallMiddleware({
    redirectPath,
    authPath,
    authCallbackPath,
    authFailUrl,
    scope,
    onAuth,
    appKey: SHOPIFY_API_KEY,
    appSecret: SHOPIFY_API_SECRET_KEY,
  });

  const verifyToken = () => (req, res, next) => {
    try {
      const { jwtToken } = req.cookies;

      jwt.verify(jwtToken, SECRET_KEY, (err) => {
        if (!err) {
          next();
        } else {
          onNoAuth(res);
        }
      });
    } catch (e) {
      onNoAuth(res);
    }
  };

  const secureMiddleware = () => verifyToken();

  const app = express();

  app.use(cookieParser());

  app.use(installAuth);

  app.post('/uninstall', async (req) => {
    const hmac = req.header('X-Shopify-Hmac-Sha256');
    const shop = req.header('X-Shopify-Shop-Domain');

    const body = await getRawBody(req);

    if (validateWebhook(SHOPIFY_API_SECRET_KEY, body, hmac)) {
      tokenAccess.deleteToken(shop);
    }
  });

  app.get('/install', async (req, res) => {
    const hmacAuthed =
      req.query.hmac && checkIntegrity(SHOPIFY_API_SECRET_KEY, req.query);

    if (!hmacAuthed) {
      onNoAuth(res);
    } else if (hmacAuthed) {
      const { shop } = req.query;

      const accessToken = await tokenAccess.getToken(shop);

      if (!accessToken) {
        const redirectUrl = url.format({
          protocol: 'https',
          pathname: authPath,
          query: {
            shop,
          },
        });

        res.redirect(redirectUrl);
      } else {
        const jwtToken = jwt.sign({ shop }, SECRET_KEY);

        res.cookie('shop', shop, { httpOnly: true });
        res.cookie('jwtToken', jwtToken, { httpOnly: true });
        res.cookie('accessToken', accessToken, { httpOnly: true });

        res.redirect(`${prefix}/${frontendRoute}/${homePage}`);
      }
    }
  });

  app.all(`/${frontendRoute}/*`, secureMiddleware());

  app.use(
    `/${frontendRoute}`,
    express.static(path.join(__dirname, frontendPath)),
  );

  app.get('/fail', (req, res) => {
    res.sendStatus(404);
  });

  app.all('/*', (req, res) => {
    res.sendStatus(404);
  });

  return app;
};

module.exports = createApp;
