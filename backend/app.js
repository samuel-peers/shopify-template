// https://4a1jqd8qfk.execute-api.us-west-2.amazonaws.com/test/auth?shop=samuelpeers-test-store.myshopify.com
import path from 'path';
import express from 'express';
import session from 'express-session';
import ShopifyAuth from 'express-shopify-auth';
import connectRedis from 'connect-redis';
import { verifyHmac, verifyInstalled } from './verify';

const RedisStore = connectRedis(session);

const {
  SHOPIFY_API_SECRET_KEY,
  SHOPIFY_API_KEY,
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT,
  SESSION_SECRET,
  LOCAL
} = process.env;

const baseUrl = LOCAL
  ? 'http://127.0.0.1:3000'
  : 'https://4a1jqd8qfk.execute-api.us-west-2.amazonaws.com/test';

const adminUrl = shop => `https://${shop}/admin/apps/${SHOPIFY_API_KEY}`;
const redirectUrl = `${baseUrl}/auth/callback`;
const authPath = '/auth';
const authCallbackPath = '/auth/callback';
const authSuccessUrl = `${baseUrl}/success`;
const authFailUrl = `${baseUrl}/fail`;
const scope = ['read_products'];
const distPath = '../../frontend/dist';
const secureDir = 'secure';

const noShopMsg = 'No shop query';
const badShopMsg = 'Bad shop hostname';

const installAuth = ShopifyAuth.create({
  baseUrl,
  redirectUrl,
  authPath,
  authCallbackPath,
  authSuccessUrl,
  authFailUrl,
  scope,
  appKey: SHOPIFY_API_KEY,
  appSecret: SHOPIFY_API_SECRET_KEY,
  shop(req, done) {
    let errMsg = !req.query.shop && noShopMsg;
    errMsg =
      errMsg || (!ShopifyAuth.checkShopHostname(req.query.shop) && badShopMsg);

    return done(errMsg, req.query.shop);
  },
  onAuth(req, res, shop, accessToken, done) {
    req.session.shopify = { shop, accessToken };
    return done();
  }
});

const app = express();

const redisStore = new RedisStore({
  host: REDIS_HOST,
  pass: REDIS_PASSWORD,
  port: REDIS_PORT
});

app.use(
  session({
    store: redisStore,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
);

app.use(installAuth);

const onNoAuth = args => {
  args.res.redirect(authFailUrl);
};

const secureMiddleware = () =>
  LOCAL
    ? async (req, res, next) => next()
    : verifyHmac(SHOPIFY_API_SECRET_KEY, onNoAuth);

app.all(`/${secureDir}/*`, secureMiddleware());

app.use(
  `/${secureDir}`,
  express.static(path.join(__dirname, distPath, secureDir))
);

app.get('/success', verifyInstalled(onNoAuth), (req, res) => {
  res.redirect(adminUrl(req.session.shopify.shop));
});

app.get('/fail', (req, res) => {
  res.sendStatus(404);
});

app.all('/*', (req, res) => {
  res.sendStatus(404);
});

export default app;
