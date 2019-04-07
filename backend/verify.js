import ShopifyAuth from 'express-shopify-auth';

export const verifyInstalled = onNoAuth => async (req, res, next) => {
  const { shopify } = req.session;

  if (shopify && shopify.accessToken) {
    await next();
  }

  onNoAuth({ res });
};

export const verifyHmac = (appSecret, onNoAuth) => async (req, res, next) => {
  if (req.session.hmacVerified) {
    await next();
  } else if (
    req.query.hmac &&
    ShopifyAuth.checkIntegrity(appSecret, req.query)
  ) {
    req.session.hmacVerified = true;
    await next();
  } else {
    onNoAuth({ res });
  }
};
