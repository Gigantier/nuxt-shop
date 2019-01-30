import configuration from '~/components/gigantier/Configuration';
import category from '~/components/gigantier/Category';
import page from '~/components/gigantier/Page';

export const state = () => ({
  shop: {},
  pages: {},
  categories: {}
})

export const mutations = {
  setShop(state, data) {
    state.shop = data;
  },
  setCategories(state, data) {
    state.categories = data;
  },
  setPages(state, data) {
    state.pages = data;
  }
}

export const actions = {
  async nuxtServerInit({ commit }, { req }) {
    const shop = await configuration.get();
    commit('setShop', shop.data);
    
    const cat = await category.get();
    commit('setCategories', cat.data);
    
    const pag = await page.get();
    commit('setPages', pag.data);
  }
}
