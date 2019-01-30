<template>
  <div id="App">
    <Heading :shop="shop" :categories="categories" />
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
    errorVisible: false
  }),
  created() {
    this.shop = this.$store.state.shop;
    this.pages = this.$store.state.pages.slice(0, 2);
    this.categories = this.$store.state.categories;

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
