<template>
  <div id="home">
  
    <div class="slider">
      <a v-for="(banner, index) in banners.top" :key="index" :href="banner.link" :target="(banner.blank ? '_blank' : '')">
        <img :src="banner.image">
      </a>
    </div>
    
    <div id="content" class="container">
    
      <aside>
      
        <ul>
          <li>
            <h2>Categorías</h2>
            <ul>
              <li v-for="(category, index) in categories" :key="index">
                <router-link :to="category.url">{{ category.name }}</router-link>
              </li>
            </ul>
          </li>
          <li class="views">
            <h2>Vistas</h2>
            <a href="#" class="view grid" :class="{ active: !list }" @click.prevent="list = false">Grilla</a>
            <a href="#" class="view list" :class="{ active: list }" @click.prevent="list = true">Lista</a>
          </li>
        </ul>
      
      </aside>
    
      <div class="content">
      
        <div class="banners">
          <a v-for="(banner, index) in banners.bottom" :key="index" :href="banner.link" :target="(banner.blank ? '_blank' : '')">
            <img :src="banner.image">
          </a>
        </div>
      
        <h2>Productos <strong>destacados</strong></h2>
        <ProductList :products="products" :list="list" />
      
      </div>
  
    </div>
  
  </div>
</template>

<script>
import Banner from '~/components/gigantier/Banner';
import Product from '~/components/gigantier/Product';
import ProductList from '~/components/ProductList.vue';

export default {
  name: 'Home',
  components: {
    ProductList
  },
  data: () => ({
    categories: [],
    products: [],
    list: false
  }),
  async asyncData(params) {
    const banners = { top: [], bottom: [] };
    let products = [];

    try {
      const top = await Banner.get('home-carrousel-desktop');
      banners.top = top.data;
    } catch (error) {
      console.error(error);
    }

    try {
      const bottom = await Banner.get('home-1st-row');
      banners.bottom = bottom.data;
    } catch (error) {
      console.error(error);
    }
    
    try {
      products = await Product.get({ home: true, limit: 8 });
      products = products.data.products;
    } catch (error) {
      console.error(error);
    }
    
    return { banners: banners, products: products };
  },
  created() {
    this.categories = this.$store.state.categories;
  }
};
</script>
