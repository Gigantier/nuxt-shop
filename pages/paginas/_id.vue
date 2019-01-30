<template>
  <div id="page" class="container clearfix">

    <h1>{{ page.title }}</h1>

    <div v-html="page.body" />
    <div v-html="page.body2" />

  </div>
</template>

<script>
import Page from '~/components/gigantier/Page';

export default {
  name: 'Page',
  middleware: 'param-slug',
  data: () => ({
    page: { }
  }),
  validate({ params }) {
    return !isNaN(params.id);
  },
  async asyncData(params) {
    const page = await Page.getPage(params.params.id);    
    return { page: page.data };
  },
  created() {
    this.load(this.$route.params.id);
  },
  beforeRouteUpdate(to, from, next) {
    this.load(to.params.id);
    next();
  },
  methods: {
    async load(id) {
      const page = await Page.getPage(id);
      this.page = page.data;
    }
  }
};
</script>
