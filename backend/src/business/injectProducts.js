const list = document.querySelector('.product-recommendations__list');

if (list) {
  const products = [{ title: 'woozle' }, { title: 'wazzle' }];

  const renderProduct = product => {
    return [
      '<div>',
      `<p class="product__title">${product.title}</p>`,
      '</div>'
    ].join('');
  };

  list.innerHTML = products
    .map(product => {
      return renderProduct(product);
    })
    .join('');
}
