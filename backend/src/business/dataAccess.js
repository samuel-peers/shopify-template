const getTokenAccess = (endpoint) => ({
  putToken: (shop, accessToken) => endpoint.putToken(shop, accessToken),
  getToken: (shop) => endpoint.getToken(shop),
});

const getProductAccess = (endpoint) => ({
  getProducts: (shop, accessToken) => endpoint.getProducts(shop, accessToken),
});

const getScriptTagAccess = (endpoint) => {
  const setScriptTag = (shop, accessToken, event, src) => {
    endpoint.setScriptTag(shop, accessToken, event, src);
  };

  return {
    setScriptTag,
  };
};

module.exports = { getTokenAccess, getProductAccess, getScriptTagAccess };
