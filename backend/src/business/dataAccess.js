export const getTokenAccess = endpoint => ({
  putToken: (shop, accessToken) => endpoint.putToken(shop, accessToken),
  getToken: shop => endpoint.getToken(shop)
});

export const getThemeAccess = endpoint => ({
  getThemes: (shop, accessToken) => endpoint.getThemes(shop, accessToken),
  setTheme: (shop, accessToken, themeId, value, assetKey) =>
    endpoint.setTheme(shop, accessToken, themeId, value, assetKey)
});

export const getProductAccess = endpoint => ({
  getProducts: (shop, accessToken) => endpoint.getProducts(shop, accessToken)
});
