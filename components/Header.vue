<template>
  <header id="header">
    <div class="container">
      <span class="toggle"><span>Menú</span></span>
      <ul class="menu">
        <li><span class="toggle" /></li>
        <li>
          <a href="" class="expand">mi cuenta</a>
          <ul>
            <li><a href="micuenta">Mis datos</a></li>
            <li><a href="pedidos">Historial de pedidos</a></li>
            <li><a href="mensajes">Mensajes</a></li>
            <li><a href="logout">Salir</a></li>
          </ul>
        </li>
        <li><router-link to="login">login</router-link></li>
        <li><router-link to="registro">regístrate</router-link></li>
      </ul>

      <p class="logo"><router-link to="/"><img :src="shop.LOGO" alt=""></router-link></p>

      <form action="buscar" method="get" class="search">
        <input type="search" placeholder="Buscar..." name="query" value="">
      </form>

      <nav>
        <ul>
          <li>
            <a href="" class="expand">categorías</a>
            <ul class="drop">
              <li v-for="(cat, index) in categories" :key="index">
                <router-link :to="cat.url">{{ cat.name }}</router-link>
              </li>
            </ul>
          </li>
          <li v-if="user.logged" class="user">
            <a href="micuenta">Hola <strong>{{ user.name }}</strong></a>
            <ul class="drop">
              <li><a href="micuenta">Mis datos</a></li>
              <li><a href="pedidos">Historial de pedidos</a></li>
              <li><a href="mensajes">Mensajes</a></li>
            </ul>
          </li>
          <li v-if="user.logged"><a class="logout" href="#" @click.prevent="logout"><img src="../assets/images/logout.svg" alt="logout"></a></li>
          <li v-if="!user.logged">
            <router-link to="/login">login</router-link>
            <form method="post" class="drop login" @submit.prevent="login">
              <h2>Ingresa tu cuenta</h2>
              <input v-model="email" type="email" name="email" placeholder="email" required>
              <input v-model="pwd" type="password" name="pwd" placeholder="contraseña" required>
              <button type="submit" name="login" value="1" class="btn">Ingresar</button>
              <p>¿no tienes cuenta? <router-link to="/registro">regístrate aquí</router-link></p>
            </form>
          </li>
          <li v-if="!user.logged"><router-link to="/registro">regístrate</router-link></li>
          <no-ssr>
            <li v-if="cartProducts.length > 0" class="cart">
              <router-link to="carrito" class="toggle active">
                <strong>{{ cartProducts.length }}</strong>
                <span>Carrito</span>
              </router-link>
              <div class="drop">
                <ul>
                  <li v-for="(product, index) in cartProducts" :key="index">
                    <div class="image">
                      <img :src="product.image" alt="">
                    </div>
                    <div class="info">
                      <p class="code">{{ product.code }}</p>
                      <p class="name">{{ product.name }}</p>
                      <p class="price">{{ $price(product.price * product.quantity) }}</p>
                      <a class="delete" @click.prevent="removeProduct(index)"><img src="~/assets/images/delete-small.svg" alt="eliminar"></a>
                    </div>
                  </li>
                </ul>
                <div class="total">
                  <p>{{ cartProducts.length }} items | <strong>Total: {{ $price(cartTotal) }}</strong></p>
                  <router-link to="carrito" class="btn">Finalizar compra</router-link>
                </div>
              </div>
            </li>
          </no-ssr>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
import User from '~/components/gigantier/User';

export default {
  name: 'Header',
  props: {
    shop: {
      type: Object,
      required: true
    },
    categories: {
      type: Array,
      required: true
    },
    cartProducts: {
      type: Array,
      required: true
    },
    cartTotal: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    email: null,
    pwd: null,
    user: null
  }),
  created() {
    this.user = User;
    this.user.init();
  },
  methods: {
    login() {
      this.$nuxt.$loading.start();
      User.login(this.email, this.pwd).catch((e) => {
        this.$nuxt.$emit('error', 'Datos inválidos.');
      }).then(() => {
        this.$nuxt.$loading.finish();
      });
    },
    removeProduct(index) {
      this.$nuxt.$emit('cartRemove', index);
    },
    logout() {
      User.logout();
    }
  }
};
</script>
