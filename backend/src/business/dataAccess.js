export const getTokenAccess = endpoint => ({
  putToken: (shop, accessToken) => endpoint.putToken(shop, accessToken),
  getToken: shop => endpoint.getToken(shop)
});

export const getProductAccess = endpoint => ({
  getProducts: (shop, accessToken) => endpoint.getProducts(shop, accessToken)
});

export const getScriptTagAccess = endpoint => {
  const setScriptTag = (shop, accessToken, event, src) => {
    endpoint.setScriptTag(shop, accessToken, event, src);
  };

  return {
    setScriptTag
  };
};
