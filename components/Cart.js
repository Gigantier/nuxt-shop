import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';

const vuexPersist = new VuexPersist({
  key: 'cart',
  storage: (!process.server ? localStorage : null)
});

Vue.use(Vuex);

const Cart = new Vuex.Store({
  plugins: [ vuexPersist.plugin ],
  state: {
    products: [],
    discounts: []
  },
  getters: {
    quantity(state) {
      return state.products.reduce((sum, p) => { return sum + p.quantity; }, 0);
    },
    total(state) {
      return state.products.reduce((sum, p) => { return sum + (p.price * p.quantity); }, 0);
    }
  },
  mutations: {
    setProducts(state, payload) {
      this.state.products = payload;
    },
    
    setDiscounts(state, payload) {
      this.state.discounts = payload;
    },
    
    add(state, payload) {
      let attributes = [];
      let version = [];
      const versions = payload.product.versions.filter(v => (v.id === payload.versionId));
      
      if (versions.length) {
        version = versions.pop();
        attributes = version.attributes.map(a => ({ name: a.name, value: a.value }))
      }
      
      this.state.products.push({
        productId: payload.product.id,
        versionId: payload.versionId,
        quantity: payload.quantity,
        code: payload.product.code,
        name: payload.product.name,
        price: (version ? version.price : payload.product.price),
        stock: Math.min((version ? version.stock : payload.product.stock), payload.product.maxQuantity),
        image: payload.product.image,
        attributes: attributes
      });
    },
    
    remove(state, index) {
      this.state.products.splice(index, 1);
    },
    
    addDiscount(state, code) {
      this.state.discounts.push(code);
    },
    
    reset() {
      this.state.products = [];
      this.state.discounts = [];
    }   
  }
});

export default Cart;
