const crypto = require('crypto');
const url = require('url');
const request = require('request');
const Cache = require('lru-cache');

const DEFAULT_SHOPIFY_HOSTNAME = 'myshopify.com';
const CACHE_MAX = 5000;
const MAX_AGE = 1000 * 60 * 5;

const checkIntegrity = (appSecret, params) => {
  const { hmac } = params;

  const message = Object.keys(params)
    .filter((key) => key !== 'hmac' && key !== 'signature')
    .sort()
    .map((key) => {
      const escapedKey = key
        .replace('%', '%25')
        .replace('&', '%26')
        .replace('=', '%3D');
      const escapedVal = params[key].replace('%', '%25').replace('&', '%26');
      return `${escapedKey}=${escapedVal}`;
    })
    .join('&');

  const ourSignature = crypto
    .createHmac('sha256', appSecret)
    .update(message)
    .digest('hex');

  return ourSignature === hmac;
};

const validShopHostname = (hostname) => {
  const shopRegex = new RegExp(
    `^[a-z0-9][a-z0-9\\-]*[a-z0-9]\\.${DEFAULT_SHOPIFY_HOSTNAME}$`,
    'i',
  );

  return hostname != null && shopRegex.test(hostname);
};

const exchangeCodeForToken = (
  { shopDomain, appKey, appSecret, code },
  onErr,
  onSuccess,
) => {
  const opts = {
    url: `https://${shopDomain}/admin/oauth/access_token`,
    form: {
      code,
      client_id: appKey,
      client_secret: appSecret,
    },
  };

  request.post(opts, (err, res, body) => {
    let result;

    if (err) {
      result = onErr(err);
    } else if (typeof body === 'string') {
      try {
        const jsonBody = JSON.parse(body);

        result = !jsonBody.access_token
          ? onErr(new Error('no access token supplied by shopify'))
          : onSuccess(jsonBody.access_token);
      } catch (e) {
        result = onErr(e);
      }
    }

    return result;
  });
};

const setNonce = (shop, cache) => {
  let nonce;

  try {
    nonce = crypto.randomBytes(12).toString('hex');
  } catch (e) {
    nonce = crypto.pseudoRandomBytes(12).toString('hex');
  }

  cache.set(shop, nonce);

  return nonce;
};

const handleCallbackPath = ({
  req,
  res,
  appKey,
  appSecret,
  onAuth,
  cache,
  onError,
}) => {
  let result;
  const params = req.query;

  if (
    !(
      params &&
      params.code &&
      params.hmac &&
      params.timestamp &&
      params.state &&
      params.shop
    )
  ) {
    const paramErr = new Error(
      `shopifyAuth: missing required query parameters (got ${Object.keys(
        params,
      ).join(',')})`,
    );
    result = onError(paramErr);
  }

  if (cache.get(params.shop) !== params.state) {
    const stateErr = new Error('shopifyAuth: state not found in cache');
    result = onError(stateErr);
  }

  if (!checkIntegrity(appSecret, params)) {
    const integrityErr = new Error(
      'shopifyAuth: integrity error (signature mismatch)',
    );
    result = onError(integrityErr);
  }

  if (!validShopHostname(params.shop)) {
    const shopErr = new Error(
      `shopifyAuth: invalid shop hostname \`${params.shop}\``,
    );
    result = onError(shopErr);
  }

  if (!result) {
    const exchangeOptions = {
      appKey,
      appSecret,
      code: params.code,
      shopDomain: params.shop,
    };

    exchangeCodeForToken(
      exchangeOptions,
      (exchangeErr) => onError(exchangeErr),
      (accessToken) => onAuth(req, res, params.shop, accessToken),
    );
  }

  return result;
};

const handleAuthPath = ({
  shop,
  redirectUri,
  res,
  cache,
  onError,
  scope,
  appKey,
}) => {
  const noShopMsg = 'No shop query';
  const badShopMsg = 'Bad shop hostname';

  let result;

  let errMsg = !shop && noShopMsg;
  errMsg = errMsg || (!validShopHostname(shop) && badShopMsg);

  if (errMsg) {
    result = onError(errMsg);
  }

  const nonce = setNonce(shop, cache);

  const redirectUrl = url.format({
    protocol: 'https',
    host: shop,
    pathname: '/admin/oauth/authorize',
    query: {
      redirect_uri: redirectUri,
      client_id: appKey,
      scope: scope.join(','),
      state: nonce,
    },
  });

  result = res.redirect(redirectUrl);

  return result;
};

const getInstallMiddleware = ({
  authFailUrl,
  authPath,
  authCallbackPath,
  appKey,
  scope,
  appSecret,
  onAuth,
  redirectPath,
}) => {
  const cache = new Cache({
    max: CACHE_MAX,
    maxAge: MAX_AGE,
  });

  const middleware = (req, res, next) => {
    const onError = (err) => {
      if (err.stack) {
        console.error(err.stack);
      } else {
        console.error(err);
      }

      res.redirect(authFailUrl);
    };

    let result;

    if (req.path !== authPath && req.path !== authCallbackPath) {
      result = next();
    }

    if (req.path === authPath) {
      const { shop } = req.query;

      const redirectUri = `https://${req.get('host')}${redirectPath}`;

      result = handleAuthPath({
        shop,
        redirectUri,
        res,
        cache,
        onError,
        scope,
        appKey,
      });
    }

    if (req.path === authCallbackPath) {
      result = handleCallbackPath({
        req,
        res,
        appKey,
        appSecret,
        onAuth,
        cache,
        onError,
      });
    }

    return result;
  };

  return middleware;
};

module.exports = { checkIntegrity, getInstallMiddleware };
