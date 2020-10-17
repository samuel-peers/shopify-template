const axios = require('axios');

const getUrl = (shop, path) => `https://${shop}/admin/api/2019-04/${path}`;

const callRest = (url, method, accessToken, data = null) =>
  axios({
    url,
    method,
    data,
    headers: {
      'X-Shopify-Access-Token': accessToken,
    },
  });

const getShopifyRest = () => {
  const get = (shop, accessToken, path) =>
    callRest(getUrl(shop, path), 'get', accessToken)
      .then((result) => result)
      .catch(console.error);

  return { get };
};

module.exports = getShopifyRest;
