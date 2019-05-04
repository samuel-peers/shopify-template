const buildModel = db => ({
  putAccessToken: (storeName, accessToken) =>
    db.putAccessToken(storeName, accessToken),

  getAccessToken: storeName => db.getAccessToken(storeName)
});

export default buildModel;
