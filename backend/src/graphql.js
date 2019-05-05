import axios from 'axios';

const getUrl = shop => `https://${shop}/admin/api/2019-04/graphql.json`;

const callGraphql = (url, accessToken, query) =>
  axios({
    url,
    data: {
      query
    },
    method: 'post',
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json'
    }
  });

const getGraphql = () => ({
  getProducts: (shop, accessToken) =>
    callGraphql(
      getUrl(shop),
      accessToken,
      `
        {
          products (first:5) {
            edges {
              node {
                title
                description
              }
            }
          }
        }
      `
    ).then(
      ({
        data: {
          data: {
            products: { edges }
          }
        }
      }) => edges
    )
});

export default getGraphql;
