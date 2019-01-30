<template>
  <footer id="footer">
    <div class="container">
      <p class="logo"><router-link to="/"><img :src="shop.LOGO" :alt="shop.NAME"></router-link></p>

      <div class="info">
        <p>
          <a :href="`mailto:${shop.FROM}`">{{ shop.FROM }}</a><br>
          Tel. {{ shop.TEL }}<br>
          {{ shop.ADDRESS }}
        </p>
      </div>

      <nav>
        <ul>
          <li v-for="(page, index) in pages" :key="index">
            <router-link :to="page.url">{{ page.title }}</router-link>
          </li>
        </ul>
      </nav>

      <ul class="social">
        <li>Seguinos en</li>
        <li v-if="shop.FACEBOOK"><a :href="shop.FACEBOOK"><img src="../assets/images/facebook.svg" alt="facebook"></a></li>
        <li v-if="shop.TWITTER"><a :href="shop.TWITTER"><img src="../assets/images/twitter.svg" alt="twitter"></a></li>
        <li v-if="shop.INSTAGRAM"><a :href="shop.INSTAGRAM"><img src="../assets/images/instagram.svg" alt="instagram"></a></li>
      </ul>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  props: {
    shop: {
      type: Object,
      required: true
    },
    pages: {
      type: Array,
      required: true
    }
  }
};
</script>
