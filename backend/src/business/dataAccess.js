const getTokenAccess = (endpoint) => ({
  putToken: (shop, accessToken) => endpoint.putToken(shop, accessToken),
  getToken: (shop) => endpoint.getToken(shop),
  deleteToken: (shop) => endpoint.deleteToken(shop),
});

module.exports = { getTokenAccess };
