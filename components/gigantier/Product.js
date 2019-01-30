import Repository from './Repository';

const resource = '/Product';

export default {
  async get(params) {
    const paramsQuery = this.buildQuery(params);    
    const products = await Repository.get(`${resource}?${paramsQuery}`);

    products.data.products = products.data.products.map((product) => {
      const newProduct = product;
      newProduct.url = this.url(product);
      return newProduct;
    });

    return products;
  },
  getProduct(id) {
    return Repository.get(`${resource}/${id}`);
  },
  getRelated(id) {
    return Repository.get(`${resource}/${id}/related`);
  },
  buildQuery(params) {
    let atts = {};
    if (params.attributes) {
      atts = params.attributes;
      delete params.attributes;
    }
    
    let paramsQuery = Object.keys(params).map(value => `${value}=${encodeURIComponent(params[value])}`).join('&');
    
    if (atts) {
      paramsQuery += `&attributes=${JSON.stringify(atts)}`;
    }
    
    return paramsQuery;
  },
  url(product) {
    const path = product.name.toLowerCase().trim().replace(' ', '-');
    return encodeURI(`/${product.id}-${path}`);
  }
};
