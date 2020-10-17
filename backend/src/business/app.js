const path = require('path');
const express = require('express');
const url = require('url');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { getInstallMiddleware, checkIntegrity } = require('./install');
const getDynamo = require('../persistence/dynamo');
const { getTokenAccess } = require('./dataAccess');

require('dotenv').config();

const tokenAccess = getTokenAccess(getDynamo());

const {
  STAGE,
  SHOPIFY_API_SECRET_KEY,
  SHOPIFY_API_KEY,
  SECRET_KEY,
  LOCAL,
  LOCAL_TEST_STORE,
} = process.env;

const prefix = STAGE ? `/${STAGE}` : '';

const adminUrl = (shop) => `https://${shop}/admin/apps/${SHOPIFY_API_KEY}`;
const authFailUrl = `${prefix}/fail`;
const redirectPath = `${prefix}/auth/callback`;
const authPath = '/auth';
const authCallbackPath = '/auth/callback';
const scope = [
  'read_products',
  'read_themes',
  'write_themes',
  'read_script_tags',
  'write_script_tags',
];

const scriptTagRoute = 'script_tags';
const scriptTagPath = `../dist/${scriptTagRoute}`;

const frontendRoute = 'secure';
const frontendPath = `../../../frontend/dist/${frontendRoute}`;
const homePage = 'index.html';

const onAuth = (req, res, shop, accessToken) => {
  tokenAccess.putToken(shop, accessToken);
  res.redirect(adminUrl(shop));
};

const onNoAuth = (res) => {
  res.redirect(authFailUrl);
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

const secureMiddleware = () =>
  (LOCAL ? (req, res, next) => next() : verifyToken());

const app = express();

app.use(cookieParser());

app.use(installAuth);

app.get('/authenticate', async (req, res) => {
  const hmacAuthed = LOCAL
    || (req.query.hmac && checkIntegrity(SHOPIFY_API_SECRET_KEY, req.query));

  if (!hmacAuthed) {
    onNoAuth(res);
  } else if (hmacAuthed) {
    const shop = LOCAL ? LOCAL_TEST_STORE : req.query.shop;

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

app.all(`${scriptTagRoute}/*`, secureMiddleware());

app.use(
  `/${scriptTagRoute}`,
  express.static(path.join(__dirname, scriptTagPath)),
);

app.get('/fail', (req, res) => {
  res.sendStatus(404);
});

app.all('/*', (req, res) => {
  res.sendStatus(404);
});

module.exports = app;
