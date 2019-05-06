import path from 'path';
import express from 'express';
import ShopifyAuth from 'express-shopify-auth';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import getDynamo from './dynamo';
import { getAccessModel } from './model';

const accessModel = getAccessModel(getDynamo());

const {
  SHOPIFY_API_SECRET_KEY,
  SHOPIFY_API_KEY,
  BASE_URL,
  STAGE,
  SECRET_KEY,
  LOCAL,
  LOCAL_TEST_STORE
} = process.env;

const baseUrl = `${BASE_URL}${STAGE ? `/${STAGE}` : ''}`;

const authFailUrl = `${baseUrl}/fail`;

const adminUrl = shop => `https://${shop}/admin/apps/${SHOPIFY_API_KEY}`;
const redirectUrl = `${baseUrl}/auth/callback`;
const authPath = '/auth';
const authCallbackPath = '/auth/callback';
const scope = ['read_products'];
const distPath = '../../frontend/dist';
const secureDir = 'secure';
const homePage = 'index.html';

const noShopMsg = 'No shop query';
const badShopMsg = 'Bad shop hostname';

const installAuth = ShopifyAuth.create({
  baseUrl,
  redirectUrl,
  authPath,
  authCallbackPath,
  authFailUrl,
  scope,
  authSuccessUrl: '',
  appKey: SHOPIFY_API_KEY,
  appSecret: SHOPIFY_API_SECRET_KEY,
  shop(req, done) {
    let errMsg = !req.query.shop && noShopMsg;
    errMsg =
      errMsg || (!ShopifyAuth.checkShopHostname(req.query.shop) && badShopMsg);

    return done(errMsg, req.query.shop);
  },
  onAuth(req, res, shop, accessToken) {
    accessModel.putAccessToken(shop, accessToken);
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
    (req.query.hmac &&
      ShopifyAuth.checkIntegrity(SHOPIFY_API_SECRET_KEY, req.query));

  const onAuth = () => res.redirect(`${baseUrl}/${secureDir}/${homePage}`);

  if (!authed) {
    onNoAuth(res);
  } else if (authed) {
    const shop = LOCAL ? LOCAL_TEST_STORE : req.query.shop;
    const jwtToken = jwt.sign({ shop }, SECRET_KEY);

    const accessToken = await accessModel.getAccessToken(shop);

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
