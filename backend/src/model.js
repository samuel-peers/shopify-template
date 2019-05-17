export const getAccessModel = endpoint => ({
  putAccessToken: (shop, accessToken) =>
    endpoint.putAccessToken(shop, accessToken),
  getAccessToken: shop => endpoint.getAccessToken(shop)
});

export const getAdminModel = endpoint => ({
  getProducts: (shop, accessToken) => endpoint.getProducts(shop, accessToken),
  getThemes: (shop, accessToken) => endpoint.getThemes(shop, accessToken),
  setTheme: (shop, accessToken, themeId, value, assetKey) =>
    endpoint.setTheme(shop, accessToken, themeId, value, assetKey)
});
