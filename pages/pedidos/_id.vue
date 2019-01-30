<template>
  <div id="cart" class="container smallest">

    <h1>Pedido #{{ order.id }}</h1>

    <div class="cart">

      <div v-for="(group, groupId) in order.products" :key="groupId">
        <div v-for="(product, index) in group.products" :key="index" class="product">

          <div class="img">
            <img :src="product.image" alt="">
          </div>

          <div class="qty">
            <h3>Cantidad</h3>
            {{ product.quantity }}
          </div>

          <div class="info">
            <h3>Detalle</h3>
            <p class="code">{{ product.code }}</p>
            <p class="name">{{ product.name }}</p>
            <p v-for="(att, j) in product.attributes" :key="j" class="att">
              {{ att.name }}: <strong>{{ att.value }}</strong>
            </p>
          </div>

          <div class="price">
            <h3>Precio</h3>
            <p>{{ $price(product.total) }}</p>
          </div>

        </div>
      </div>

    </div>

    <div class="summary">
      <div class="shipping">
        <div class="pickup">
          <label>Forma de envío:</label>
          <select disabled><option>{{ order.carrier }}</option></select>

          <label>Forma de pago:</label>
          <select disabled><option>{{ order.paymentMethod }}</option></select>

          <label>Estado:</label>
          <select disabled><option>{{ order.status }}</option></select>
        </div>
      </div>

      <div class="totals">
        <form v-if="order.discount" method="post">
          <p class="amount">
            Monto descontado: {{ $price(-order.discount) }}
          </p>
        </form>

        <div class="bottom">
          <p class="ship">Adicional por envío: <strong id="shipping">{{ $price(order.shipping) }}</strong></p>
          <div class="total">
            <p>Total a pagar</p>
            <big id="total">{{ $price(order.total) }}</big>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import Order from '~/components/gigantier/Order';

export default {
  name: 'Order',
  middleware: 'param-slug',
  validate({ params }) {
    return !isNaN(params.id);
  },
  async asyncData(params) {
    const orderId = params.params.id;
    const order = await Order.getOrder(orderId);
    return { order: order.data };
  },
  data: () => ({
  }),
  beforeRouteUpdate(to, from, next) {
    this.load(to.params.id);
    next();
  },
  methods: {
    async load(id) {
      const order = await Order.getOrder(id);
      this.order = order.data;
    }
  }
};
</script>
