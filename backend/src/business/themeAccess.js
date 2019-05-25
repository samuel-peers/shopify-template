const getThemeAccess = endpoint => {
  const getMainTheme = async (shop, accessToken, key) => {
    let result = null;

    const noMainMsg = 'No main theme found';

    const themeData = await endpoint.getThemes(shop, accessToken);

    const mainThemeDatum = themeData.find(({ role }) => role === 'main');

    if (!mainThemeDatum) {
      console.error(noMainMsg);
    } else {
      result = await endpoint.getTheme(
        shop,
        accessToken,
        mainThemeDatum.id,
        key
      );
    }

    return result;
  };

  const appendProductTheme = async (shop, accessToken, appendValue) => {
    let success = true;

    const key = 'templates/product.liquid';

    const mainTheme = await getMainTheme(shop, accessToken, key);

    if (!mainTheme) {
      success = false;
    } else {
      const {
        asset: { value, theme_id: themeId }
      } = mainTheme;

      const newValue = `${value}\n${appendValue}`;

      endpoint.setTheme(shop, accessToken, themeId, newValue, key);
    }

    return success;
  };

  const addProductList = async (shop, accessToken) => {
    const className = 'product-recommendations__list';
    const dataProductId = 'data-product-id="{{ product.id }}"';
    const productList = `<div class="${className}" ${dataProductId}/>`;

    appendProductTheme(shop, accessToken, productList);
  };

  return {
    appendProductTheme,
    addProductList,
    getMainTheme
  };
};

export default getThemeAccess;
