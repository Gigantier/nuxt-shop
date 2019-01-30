export default {
    
  save(index, data) {
    if (localStorage) {
      localStorage[index] = JSON.stringify(data);
    }
  },

  get(field) {
    if (process.server) {
      return null;
    }

    try {
      if (localStorage[field]) {
        return JSON.parse(localStorage[field]);
      } else {
        return null;
      }
    } catch {
      return null;
    }
  },
    
  discounts() {
    const obj = this.get('discounts');
    if (Array.isArray(obj)) {
      return obj;
    } else {
      return [];
    }
  },
    
  products() {
    const obj = this.get('products');
    if (Array.isArray(obj)) {
      return obj;
    } else {
      return [];
    }
  },
    
  add(productId, versionId, quantity, data) {
    const prods = this.products();
    
    let attributes = [];
    let version = [];
    const versions = data.versions.filter(v => (v.id === versionId));
    
    if (versions.length) {
      version = versions.pop();
      attributes = version.attributes.map(a => ({ name: a.name, value: a.value }))
    }
    
    prods.push({
      productId: productId,
      versionId: versionId,
      quantity: quantity,
      code: data.code,
      name: data.name,
      price: (version ? version.price : data.price),
      stock: (version ? version.stock : data.stock),
      image: data.image,
      attributes: attributes
    });

    this.save('products', prods);
  },
  
  addDiscount(code) {
    const discs = this.discounts();
    discs.push(code);
    this.save('discounts', discs);
  },
  
  updateProducts(products) {
    this.save('products', products);
  },
  
  total() {
    return this.products().reduce((sum, p) => { return sum + (p.price * p.quantity); }, 1);
  }

};
