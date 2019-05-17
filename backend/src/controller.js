import getShopifyRest from './endpoints/shopifyRest';
import { getAdminModel } from './model';

const adminModel = getAdminModel(getShopifyRest());

export const setTheme = async (shop, accessToken, id, value, key) => {
  await adminModel.setTheme(shop, accessToken, id, value, key);
};

export const getMainTheme = async (shop, accessToken) => {
  let id = -1;

  const noMainMsg = 'No main theme found';

  const themes = await adminModel.getThemes(shop, accessToken);

  const main = themes.find(({ role }) => role === 'main');

  if (main) {
    console.error(noMainMsg);
  } else {
    ({ id } = main);
  }

  return id;
};

export const setProductTheme = async (shop, accessToken) => {
  let success = true;

  const value = '<div>test value</div>';
  const key = 'templates/product.liquid';

  const id = await getMainTheme(shop, accessToken);

  if (id === -1) {
    success = false;
  } else {
    setTheme(shop, accessToken, id, value, key);
  }

  return success;
};
