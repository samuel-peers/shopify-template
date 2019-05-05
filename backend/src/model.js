export const getAccessModel = db => ({
  putAccessToken: (shop, accessToken) => db.putAccessToken(shop, accessToken),

  getAccessToken: shop => db.getAccessToken(shop)
});

export const getAdminModel = db => ({
  getProducts: (shop, accessToken) => db.getProducts(shop, accessToken)
});
