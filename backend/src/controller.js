import getShopifyRest from './endpoints/shopifyRest';
import { getAdminModel } from './model';

const adminModel = getAdminModel(getShopifyRest());

export const setTheme = async (shop, accessToken, value, key) => {
  let success = true;

  const noMainMsg = 'No main theme found';

  const themes = await adminModel.getThemes(shop, accessToken);

  const main = themes.find(({ role }) => role === 'main');

  if (!main) {
    success = false;
    console.error(noMainMsg);
  } else {
    const { id } = main;

    await adminModel.setTheme(shop, accessToken, id, value, key);
  }

  return success;
};

export const setProductTheme = async (shop, accessToken) => {
  const value = '<div>test value</div>';
  const key = 'templates/product.liquid';

  return setTheme(shop, accessToken, value, key);
};
