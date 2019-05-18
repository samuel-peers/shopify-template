import path from 'path';
import express from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { getInstallMiddleware, checkIntegrity } from './business/install';
import getDynamo from './persistence/dynamo';
import { getTokenAccess, getThemeAccess } from './business/dataAccess';
import getThemeController from './business/themeController';
import getShopifyRest from './persistence/rest';

const tokenAccess = getTokenAccess(getDynamo());
const themeAccess = getThemeAccess(getShopifyRest());

const themeController = getThemeController(themeAccess);

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
const scope = ['read_products', 'read_themes', 'write_themes'];
const distPath = '../../frontend/dist';
const secureDir = 'secure';
const homePage = 'index.html';

const installAuth = getInstallMiddleware({
  redirectPath,
  authPath,
  authCallbackPath,
  authFailUrl,
  scope,
  appKey: SHOPIFY_API_KEY,
  appSecret: SHOPIFY_API_SECRET_KEY,
  onAuth: (req, res, shop, accessToken) => {
    tokenAccess.putToken(shop, accessToken);
    themeController.setProductTheme(shop, accessToken);
    res.redirect(adminUrl(shop));
  }
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

  const onAuth = () => res.redirect(`${prefix}/${secureDir}/${homePage}`);

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

      onAuth();
    }
  }
});

app.all(`/${secureDir}/*`, secureMiddleware());

app.use(
  `/${secureDir}`,
  express.static(path.join(__dirname, distPath, secureDir))
);

app.get('/fail', (req, res) => {
  res.sendStatus(404);
});

app.all('/*', (req, res) => {
  res.sendStatus(404);
});

export default app;
