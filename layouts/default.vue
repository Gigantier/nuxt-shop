<template>
  <div id="App">
    <Heading :shop="shop" :categories="categories" :cart-products="cartProducts" />
    <main id="main">
      <nuxt />
    </main>
    <Foot :shop="shop" :pages="pages" />
    <Error :message="errorMessage" :visible="errorVisible" />
  </div>
</template>

<style lang="scss">
@import '~/assets/css/global.scss';
</style>

<script>
import Error from '~/components/Error';
import Heading from '~/components/Header.vue';
import Foot from '~/components/Footer.vue';
import Cart from '~/components/Cart';

export default {
  name: 'App',
  components: {
    Heading,
    Foot,
    Error
  },
  data: () => ({
    shop: {},
    pages: [],
    categories: [],
    errorMessage: null,
    errorVisible: false,
    cartProducts: []
  }),
  created() {
    this.shop = this.$store.state.shop;
    this.pages = this.$store.state.pages.slice(0, 2);
    this.categories = this.$store.state.categories;
    this.cartProducts = Cart.products();
    
    this.$nuxt.$on('cartUpdated', (message) => {
      this.cartProducts = Cart.products();
    });

    this.$nuxt.$on('error', (message) => {
      this.errorVisible = true;
      this.errorMessage = message;
    });

    this.$nuxt.$on('dimissError', () => {
      this.errorVisible = false;
      this.errorMessage = null;
    });
  }
};
</script>
