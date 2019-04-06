import ShopifyAuth from 'express-shopify-auth';

export const verifyInstalled = authFailUrl => async (req, res, next) => {
  const { shopify } = req.session;

  if (shopify && shopify.accessToken) {
    await next();
  }

  res.redirect(authFailUrl);
};

export const verifyHmac = (appSecret, authFailUrl) => async (
  req,
  res,
  next
) => {
  console.log('SEEEEEEEEEEEEEEEESSSSSSSSSSSSSSSSSSSSIIIIIIIIOOOOOOONNNNNNNN');
  console.log(req.session);
  if (req.session.hmacVerified) {
    await next();
  } else if (
    req.query.hmac &&
    ShopifyAuth.checkIntegrity(appSecret, req.query)
  ) {
    req.session.hmacVerified = true;
    await next();
  } else {
    res.redirect(authFailUrl);
  }
};
