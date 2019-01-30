<template>
  <div id="listing">
  
    <div id="content" class="container">
    
      <aside>
      
        <ul>
          <li>
            <h2>Categorías</h2>
            <ul>
              <li v-for="(cat, index) in categories" :key="index" :class="{ active: (category.id == cat.id) }">
                <router-link :to="cat.url">{{ cat.name }}</router-link>
              </li>
            </ul>
          </li>
          <li>
            <h2>Ordenar por</h2>
            <ul>
              <li :class="{ active: (sort == 'price') }"><a href="#" @click.prevent="sort = 'price'">menor precio</a></li>
              <li :class="{ active: (sort == 'created') }"><a href="#" @click.prevent="sort = 'created'">novedades</a></li>
              <li :class="{ active: (sort == 'discount') }"><a href="#" @click.prevent="sort = 'discount'">descuento</a></li>
            </ul>
          </li>
          <li v-for="(att, index) in attributes" :key="index">
            <h2>{{ att.name }}</h2>
            <ul class="collapse" :class="{ color: att.color, size: !att.color }">
              <li v-for="(value, i) in att.values" v-if="!att.color || att.colors[i]" :key="i" :class="{ active: (attributes[index].selected && attributes[index].selected.indexOf(value) !== -1) }">
                <a href="#" :style="{ backgroundColor: att.colors[i] }" @click.prevent="selectAttribute(index, value)">{{ value }}</a>
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
      
        <h1>{{ category.name }}</h1>
        <ProductList :products="products" :list="list" />
      
      </div>
    
    </div>
    
  </div>
</template>

<script>
import Category from '~/components/gigantier/Category';
import Product from '~/components/gigantier/Product';
import ProductList from '~/components/ProductList.vue';

export default {
  name: 'Category',
  middleware: 'param-slug',
  validate({ params }) {
    return !isNaN(params.id);
  },
  components: {
    ProductList
  },
  async asyncData(params) {
    const categoryId = params.params.id;

    const category = await Category.getCategory(categoryId);    
    const prods = await Product.get({ categoryId: categoryId });
    
    return { category: category.data, products: prods.data.products, attributes: prods.data.attributes };
  },
  data: () => ({
    categories: [],
    list: false,
    products: [],
    attributes: [],

    sort: 'created',
    category: {},
    attributesFilters: {}
  }),
  watch: {
    category() {
      this.loadProducts();
    },
    sort() {
      this.loadProducts();
    },
    attributesFilters() {
      this.loadProducts();
    }
  },
  created() {
    this.categories = this.$store.state.categories;
  },
  beforeRouteUpdate(to, from, next) {
    this.load(to.params.id);
    next();
  },
  methods: {
    async load(id) {
      this.attributesFilters = {};

      const category = await Category.getCategory(id);
      this.category = category.data;
    },
    async loadProducts() {
      const params = {
        categoryId: this.category.id,
        sort: this.sort,
        attributes: this.attributesFilters
      };
      
      const products = await Product.get(params);
      
      this.products = products.data.products;
      this.attributesChanged(products.data.attributes);
    },
    attributesChanged(atts) {
      // Keep selected values
      const keys = Object.keys(this.attributes);
      
      for (let i = 0; i < keys.length; i += 1) {
        if (this.attributes[keys[i]].selected) {
          atts[keys[i]].selected = this.attributes[keys[i]].selected;
        }
      }
      
      this.attributes = atts;
    },
    attributeSelected(attId, value) {
      return (this.attributesFilters[attId] && this.attributesFilters[attId].indexOf(value) !== -1);
    },
    selectAttribute(attIndex, value) {
      const attId = this.attributes[attIndex].id;
      let current = this.attributesFilters[attId];
      
      if (this.attributeSelected(attId, value)) {
        // Remove filter
        const where = current.indexOf(value);
        current.splice(where, 1);  
      } else {
        // Add filter
        if (!current) {
          current = [];
        }
        
        current.push(value);
      }
      
      // Force VueJS rendering
      this.$set(this.attributesFilters, attId, current);
      this.$set(this.attributes[attIndex], 'selected', current);
    }
  }
};

</script>
