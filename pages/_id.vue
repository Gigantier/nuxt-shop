<template>
  <div id="product" class="container small">
    
    <ul class="breadcrumb" />
    
    <div id="details">
      
      <div class="photos">
        <div v-if="product.discount" class="discount"><span><big>{{ product.discount }}%</big>OFF</span></div>
        
        <div class="product-slider">
          <a v-for="(image, i) in product.images" :key="i" :href="image.image"><img :src="image.image" :alt="product.name"></a>
        </div>
        
        <div class="main-product-slider">
          <a :href="product.image" class="gallery"><img :src="product.image" :alt="product.name"></a>
        </div>
      </div>
      
      <div class="info">
        <div class="main">
          
          <p class="favourite"><span class="fav toggleFav" /> <span class="label">Agregar a favoritos</span></p>
          <h1>{{ product.name }} <strong v-if="product.discount">{{ product.discount }}% off</strong></h1>
          <p class="code">Código de producto: {{ product.code }}</p>
        
          <div class="prices">
            <p id="price">{{ $price(product.price) }}</p>
            <p v-show="product.originalPrice > product.price" id="original">antes <s id="originalPrice">{{ $price(product.originalPrice) }}</s></p>
          </div>
        
        </div>
      
        <form id="buy" method="post" @submit.prevent="buy">
        
          <div v-for="(att, index) in product.attributes" :key="index" class="attribute">              
            <label>
              {{ att.name }}
              <select v-model="attribute[att.id]" class="attribute" required>
                <option :value="null">Seleccione</option>
                <option v-for="(value, j) in att.values" :key="j" :value="value">{{ value }}</option>
              </select>
            </label>
          </div>
          
          <div v-if="versionSelected && hasStock" id="stockOk">
          
            <button type="submit" class="btn" name="buy" value="1">Agregar al carrito</button>
          
          </div>
          
          <div v-if="product.versions.length > 0">
            <div v-show="!attribute[1]">
              <button type="button" class="btn" disabled="disabled">Selecciona una talla</button>
            </div>
            
            <div v-show="attribute[1] && !attribute[2]">
              <button type="button" class="btn" disabled="disabled">Selecciona un color</button>
            </div>
          </div>
          
          <div v-show="versionSelected && !hasStock" id="stockError">
            <button type="button" class="btn" disabled="disabled">Producto sin stock</button>
          </div>
        </form>
        
        <p v-if="product.freeShipping" class="extra truck">
          <object type="image/svg+xml" data="~/assets/images/truck.svg" />
          Envío gratis
        </p>

        <p v-if="product.installments" class="extra card">
          <object type="image/svg+xml" data="~/assets/images/card.svg" />
          Hasta {{ installments }} cuotas sin interés
        </p>
        
        <div v-if="product.description" class="description">
          <h3>Detalle:</h3>
          <div v-html="product.description" />
        </div>
      </div>
      
      <div class="photos secondary">
      
        <div class="tabs">
        
          <div v-if="shop.delivery" class="tab">
            <h2><span>Características y cuidado<br>del producto</span></h2>
            <div v-html="shop.delivery" />
          </div>
          
          <div v-if="shop.warranty" class="tab">
            <h2><span>Política de garantías<br>y devoluciones</span></h2>
            <div v-html="shop.warranty" />
          </div>
        </div>
      
      </div>
    
    </div>
    
    <div id="related">
      <h2>También pueden gustarte</h2>
      
      <ProductList :products="related" :small="true" />
    </div>
  
  </div>
</template>

<script>
import Product from '~/components/gigantier/Product';
import ProductList from '~/components/ProductList';
import Cart from '~/components/Cart';

export default {
  name: 'Product',
  middleware: 'param-slug',
  validate({ params }) {
    return !isNaN(params.id);
  },
  components: {
    ProductList
  },
  async asyncData(params) {
    const product = await Product.getProduct(params.params.id);
    const related = await Product.getRelated(params.params.id);
    return { product: product.data, related: related.data.products.slice(0, 5) };
  },
  data: () => ({
    shop: {},
    attribute: {
      1: null,
      2: null
    }
  }),
  computed: {
    version: function () {
      return this.getVersion();
    },
    hasStock: function () {
      if (this.product.versions.length === 0) {
        return (this.product.stock > 0);
      } else {
        return (this.version && this.version.stock > 0);
      }
    },
    versionSelected: function () {
      if (this.product.versions.length === 0) {
        return true;
      } else {
        const version = this.product.versions[0];
        for (let i = 0; i < version.attributes.length; i++) {
          if (this.attribute[version.attributes[i].id] === null) {
            return false;
          }
        }
        return true;
      }
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.load(to.params.id);
    next();
  },
  created() {
    this.shop = this.$store.state.shop;
  },
  methods: {
    async load(id) {
      const product = await Product.getProduct(id);
      this.product = product.data;

      const related = await Product.getRelated(id);
      this.related = related.data.products.slice(0, 5);
    },
    getVersion() {
      if (this.product.versions.length === 0) {
        return null;
      }
      
      for (let i = 0; i < this.product.versions.length; i++) {
        let ok = true;
        
        for (let j = 0; j < this.product.versions[i].attributes.length; j++) {
          const atts = this.product.versions[i].attributes[j];
          if (atts.value !== this.attribute[atts.id]) {
            ok = false;
            break;
          }
        }
        
        if (ok) {
          return this.product.versions[i];
        }
      }
      
      return null;
    },
    buy() {
      Cart.commit('add', {
        product: this.product,
        versionId: (this.version ? this.version.id : null),
        quantity: 1
      });
      this.$router.push('/carrito');
    }
  }
};
</script>
