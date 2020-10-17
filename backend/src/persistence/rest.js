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
  const getThemes = (shop, accessToken) => {
    const path = 'themes.json';

    return callRest(getUrl(shop, path), 'get', accessToken)
      .then(({ data: { themes } }) => themes)
      .catch(console.error);
  };

  const getTheme = (shop, accessToken, themeId, key) => {
    const path = `themes/${themeId}/assets.json?asset[key]=${key}`;

    return callRest(getUrl(shop, path), 'get', accessToken)
      .then(({ data }) => data)
      .catch(console.error);
  };

  const setTheme = (shop, accessToken, themeId, value, key) => {
    const path = `themes/${themeId}/assets.json`;

    const data = {
      asset: {
        value,
        key,
      },
    };

    return callRest(getUrl(shop, path), 'put', accessToken, data).catch(
      console.error,
    );
  };

  const setScriptTag = (shop, accessToken, event, src) => {
    const path = 'script_tags.json';

    const data = {
      script_tag: {
        event,
        src,
      },
    };

    return callRest(getUrl(shop, path), 'post', accessToken, data).catch(
      console.error,
    );
  };

  return {
    getThemes,
    getTheme,
    setTheme,
    setScriptTag,
  };
};

module.exports = getShopifyRest;
