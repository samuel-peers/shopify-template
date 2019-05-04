import axios from 'axios';

export const getProductsEndpoint = shop =>
  axios.get(`${shop}/admin/products.json`);
