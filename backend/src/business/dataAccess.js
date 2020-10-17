const getTokenAccess = (endpoint) => ({
  putToken: (shop, accessToken) => endpoint.putToken(shop, accessToken),
  getToken: (shop) => endpoint.getToken(shop),
});

module.exports = { getTokenAccess };
