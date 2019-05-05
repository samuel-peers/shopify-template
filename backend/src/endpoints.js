import axios from 'axios';

export const getProductsEndpoint = (shop, accessToken) =>
  axios({
    method: 'get',
    url: `https://${shop}/admin/products.json`,
    headers: {
      'X-Shopify-Access-Token': accessToken
    }
  });

export const getgraph = (shop, accessToken) =>
  axios({
    method: 'post',
    url: `https://${shop}/admin/api/2019-04/graphql.json`,
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json'
    },
    data: {
      query: `
        {
          products(first:5){
            edges{
              node{
                id
              }
            }
          }
        }
        `
    }
  });

export default getProductsEndpoint;
