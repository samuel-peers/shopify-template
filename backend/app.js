import path from 'path';
import express from 'express';
import ShopifyAuth from 'express-shopify-auth';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const {
  SHOPIFY_API_SECRET_KEY,
  SHOPIFY_API_KEY,
  BASE_URL,
  STAGE,
  SECRET_KEY
} = process.env;

const baseUrl = `${BASE_URL}/${STAGE}`;

const authFailUrl = `${baseUrl}/fail`;

const onNoAuth = args => {
  args.res.redirect(authFailUrl);
};

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
    // TODO save (shop, accessToken) to persistence
    console.log(accessToken);
    res.redirect(adminUrl(shop));
  }
});

const verifyToken = () => (req, res, next) => {
  try {
    const { token } = req.cookies;

    jwt.verify(token, SECRET_KEY, err => {
      if (!err) {
        req.verified = true;
      }
      next();
    });
  } catch (e) {
    next();
  }
};

const checkVerified = () => (req, res, next) => {
  if (req.verified) {
    next();
  } else {
    onNoAuth({ res });
  }
};

const app = express();

app.use(cookieParser());

app.use(installAuth);

app.get('/authenticate', (req, res) => {
  const authed =
    req.query.hmac &&
    ShopifyAuth.checkIntegrity(SHOPIFY_API_SECRET_KEY, req.query);

  if (!authed) {
    onNoAuth({ res });
  } else {
    const { shop } = req.query;
    const token = jwt.sign({ shop }, SECRET_KEY);

    res.cookie('token', token, { httpOnly: true });
    res.cookie('shop', shop, { httpOnly: true });

    res.redirect(`${baseUrl}/${secureDir}/${homePage}`);
  }
});

app.all(`/${secureDir}/*`, verifyToken(), checkVerified());

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
