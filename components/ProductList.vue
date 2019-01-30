<template>
  <ul class="listing" :class="{ list: list, small: small }">
    <li v-for="(product, index) in products" :key="index" class="analyticsProduct" :class="{ agotado: !product.stock }" :data-id="product.id" itemscope itemtype="http://schema.org/Product" :data-manufacturer="product.manufacturer">
      <form method="post">
        <router-link :to="product.url">
          <div class="image">
            <div v-if="product.discount" class="discount"><span><big>{{ product.discount }}%</big>OFF</span></div>
            <img :src="product.thumbnails.x300" alt="">
          </div>
          
          <div class="info">
            <span class="fav toggleFav" />
            <h2>{{ product.name }}</h2>
            <p class="price"><span>{{ $price(product.price) }}</span></p>
            
            <p v-if="product.freeShipping" class="extra truck">
              <object type="image/svg+xml" data="/assets/images/truck.svg" />
              Envío gratis
            </p>
            
            <p v-if="product.installments" class="extra card">
              <object type="image/svg+xml" data="/assets/images/card.svg" />
              Hasta {{ product.installments }} cuotas sin interés
            </p>
          </div>
          
          <div class="button">
            <button class="btn" type="submit">Agregar al carrito</button>
          </div>
        </router-link>
      </form>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'ProductList',
  props: {
    list: {
      type: Boolean,
      required: false,
      default: false
    },
    small: {
      type: Boolean,
      required: false,
      default: false
    },
    products: {
      type: Array,
      required: true
    }
  }
};
</script>
