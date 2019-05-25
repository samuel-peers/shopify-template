import path from 'path';
import express from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { getInstallMiddleware, checkIntegrity } from './business/install';
import getDynamo from './persistence/dynamo';
import { getTokenAccess, getScriptTagAccess } from './business/dataAccess';
import getThemeAccess from './business/themeAccess';
import getShopifyRest from './persistence/rest';

const tokenAccess = getTokenAccess(getDynamo());
const themeAccess = getThemeAccess(getShopifyRest());
const scriptTagAccess = getScriptTagAccess(getShopifyRest());

const {
  STAGE,
  SHOPIFY_API_SECRET_KEY,
  SHOPIFY_API_KEY,
  SECRET_KEY,
  LOCAL,
  LOCAL_TEST_STORE
} = process.env;

const prefix = STAGE ? `/${STAGE}` : '';

const adminUrl = shop => `https://${shop}/admin/apps/${SHOPIFY_API_KEY}`;
const authFailUrl = `${prefix}/fail`;
const redirectPath = `${prefix}/auth/callback`;
const authPath = '/auth';
const authCallbackPath = '/auth/callback';
const scope = [
  'read_products',
  'read_themes',
  'write_themes',
  'read_script_tags',
  'write_script_tags'
];

const scriptTagRoute = 'script_tags';
const scriptTagPath = `../dist/${scriptTagRoute}`;
const scriptTagFile = 'index.js';
const scriptTagSrc = (req, file) =>
  `https://${req.get('host')}${prefix}/${scriptTagRoute}/${file}`;

const frontendRoute = 'secure';
const frontendPath = `../../frontend/dist/${frontendRoute}`;
const homePage = 'index.html';

const onAuth = (req, res, shop, accessToken) => {
  tokenAccess.putToken(shop, accessToken);

  themeAccess.addProductList(shop, accessToken);

  scriptTagAccess.setScriptTag(
    shop,
    accessToken,
    'onload',
    scriptTagSrc(req, scriptTagFile)
  );

  res.redirect(adminUrl(shop));
};

const installAuth = getInstallMiddleware({
  redirectPath,
  authPath,
  authCallbackPath,
  authFailUrl,
  scope,
  onAuth,
  appKey: SHOPIFY_API_KEY,
  appSecret: SHOPIFY_API_SECRET_KEY
});

const onNoAuth = res => {
  res.redirect(authFailUrl);
};

const verifyToken = () => (req, res, next) => {
  try {
    const { jwtToken } = req.cookies;

    jwt.verify(jwtToken, SECRET_KEY, err => {
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
  LOCAL ? (req, res, next) => next() : verifyToken();

const app = express();

app.use(cookieParser());

app.use(installAuth);

app.get('/authenticate', async (req, res) => {
  const authed =
    LOCAL ||
    (req.query.hmac && checkIntegrity(SHOPIFY_API_SECRET_KEY, req.query));

  if (!authed) {
    onNoAuth(res);
  } else if (authed) {
    const shop = LOCAL ? LOCAL_TEST_STORE : req.query.shop;
    const jwtToken = jwt.sign({ shop }, SECRET_KEY);

    const accessToken = await tokenAccess.getToken(shop);

    if (!accessToken) {
      onNoAuth(res);
    } else {
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
  express.static(path.join(__dirname, frontendPath))
);

app.all(`${scriptTagRoute}/*`, secureMiddleware());

app.use(
  `/${scriptTagRoute}`,
  express.static(path.join(__dirname, scriptTagPath))
);

app.get('/fail', (req, res) => {
  res.sendStatus(404);
});

app.all('/*', (req, res) => {
  res.sendStatus(404);
});

export default app;
