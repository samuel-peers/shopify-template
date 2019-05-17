import axios from 'axios';

const getUrl = (shop, path) => `https://${shop}/admin/api/2019-04/${path}`;

const callRest = (url, method, accessToken, data = null) =>
  axios({
    url,
    method,
    data,
    headers: {
      'X-Shopify-Access-Token': accessToken
    }
  });

const getShopifyRest = () => ({
  getThemes: (shop, accessToken) => {
    const path = 'themes.json';

    return callRest(getUrl(shop, path), 'get', accessToken)
      .then(({ data: { themes } }) => themes)
      .catch(err => console.log(err));
  },

  setTheme: (shop, accessToken, themeId, value, key) => {
    const path = `themes/${themeId}/assets.json`;

    const data = {
      asset: {
        value,
        key
      }
    };

    return callRest(getUrl(shop, path), 'put', accessToken, data).catch(err =>
      console.log(err)
    );
  }
});

export default getShopifyRest;
