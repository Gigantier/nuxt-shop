<template>
  <div id="cart" class="container smallest">
  
    <div v-if="products.length > 0">
      <h1>Mi carrito de compras</h1>
      
      <div class="cart">
      
        <div v-for="(product, index) in products" :key="index" class="product">
        
          <div class="img">
            <img :src="product.image" alt="">
          </div>
          
          <div class="qty">
            <h3>Cantidad</h3>
            <div class="stepper">
              <button class="less" @click.prevent="addQuantity(index, -1)">-</button>
              <input v-model="products[index].quantity" type="text" @change="updateQuantity(index)">
              <button class="more" @click.prevent="addQuantity(index, 1)">+</button>
            </div>
          </div>
          
          <div class="info">
            <h3>Detalle</h3>
            <p class="code">{{ product.code }}</p>
            <p class="name">{{ product.name }}</p>
            <p v-for="(attribute, index2) in product.attributes" :key="index2" class="att">{{ attribute.name }}: <strong>{{ attribute.value }}</strong></p>
          </div>
          
          <div class="price">
            <h3>Precio</h3>
            <p>{{ $price(product.price * product.quantity) }}</p>
          </div>
        
          <div class="delete">
            <a href=""><img src="../assets/images/delete.svg" alt=""></a>
          </div>
        
        </div>
      
      </div>
      
      <div class="summary">
        <div class="shipping">
          <div class="pickup">
            <label for="stateId">Departamento:</label>
            <select id="stateId" v-model="stateId">
              <option v-for="(state, index) in states" :key="index" :value="state.id">{{ state.name }}</option>
            </select>
            
            <label for="cityId">Ciudad:</label>
            <select id="cityId" v-model="cityId">
              <option v-for="(city, index) in cities" :key="index" :value="city.id">{{ city.name }}</option>
            </select>
          </div>
            
          <div v-for="(carrier, index) in carriers" :key="index" class="pickup carrier">
            <label>
              <input v-model="carrierId" type="radio" name="carrierId" :value="carrier.id">
              <span>Envío con {{ carrier.name }}</span>
            </label>
          </div>
          
          <p v-if="carrierLoading">Cargando...</p>
        </div>
        
        <div class="totals">
          <form @submit.prevent="addDiscount()">
            <label for="discount">Tengo un código de descuento:</label>
            
            <fieldset>
              <input id="discount" v-model="newDiscount" type="text" name="discount" placeholder="Ingresa el código">
              <button type="submit" class="btn">Aplicar</button>
            </fieldset>
            
            <p v-if="discount > 0" class="amount">
              Monto descontado: -{{ $price(discount) }}
            </p>
          </form>
          
          <div class="bottom">
            <p class="ship">Adicional por envío: <strong id="shipping">{{ $price(shipping) }}</strong></p>
            <div class="total">
              <p>Total a pagar</p>
              <big id="total">{{ $price(total) }}</big>
            </div>
          </div>
        </div>
      </div>
      
      <form id="pay" @submit.prevent="newOrder()">
      
        <h2>Completá tus datos</h2>
        
        <div class="row">
          <label>
            Nombre
            <input v-model="name" type="text" name="name" required="required">
          </label>
          <label>
            Apellido
            <input v-model="surname" type="text" name="surname" required="required">
          </label>
        </div>
        
        <div class="row">
          <label>
            E-mail
            <input v-model="email" type="email" name="email" required="required">
          </label>
          <label>
            Teléfono
            <input v-model="tel" type="text" name="tel" required="required">
          </label>
        </div>
        
        <div class="row">
          <label>
            Provincia
            <select v-model="stateId" required="required">
              <option v-for="(state, index) in states" :key="index" :value="state.id">{{ state.name }}</option>
            </select>
          </label>
          <label>
            Ciudad
            <select v-model="cityId" required="required">
              <option v-for="(city, index) in cities" :key="index" :value="city.id">{{ city.name }}</option>
            </select>
          </label>
        </div>
        
        <div class="row">
          <label>
            Dirección
            <input v-model="address" type="text" name="address" required="required">
          </label>
          <label>
            Código postal
            <input v-model="cp" type="text" name="cp" required="required">
          </label>
        </div>
        
        <h2>Forma de pago</h2>
        
        <div v-for="(method, index) in paymentMethods" :key="index" class="paymentMethod">
          <label>
            <input v-model="paymentMethodId" :value="method.id" name="paymentMethodId" type="radio" required="required">
            <img :src="`/images/card/${method.id}.svg`" alt="tarjeta">
            <small>{{ method.name }}</small>
          </label>
        </div>
        
        <label class="tos">
          <input type="checkbox" name="tos" required="required">
          He leído y acepto los <a href="">términos y condiciones</a>
        </label>
        
        <div v-if="!creating" class="buttons">
          <a href="" class="btn secondary">Seguir comprando</a>
          <button type="submit" class="btn" name="pagar">Finalizar ahora</button>
        </div>
        
        <div v-if="creating" class="buttons">
          <button type="button" class="btn" name="pagar" disabled="disabled">Espere por favor...</button>
        </div>          
        
      </form>
    </div>
    
    <div v-if="products.length === 0" class="empty">
      <h2>Aún no has agregado ningún producto al carrito</h2>
      <a href="" class="btn">Ir a comprar</a>
    </div>
  
  </div>
</template>

<script>
import Cart from '~/components/Cart';
import PaymentMethod from '~/components/gigantier/PaymentMethod';
import Country from '~/components/gigantier/Country';
import State from '~/components/gigantier/State';
import City from '~/components/gigantier/City';
import Carrier from '~/components/gigantier/Carrier';
import Order from '~/components/gigantier/Order';
  
export default {
  name: 'Cart',
  data: () => ({
    products: [],
    newDiscount: '',
    name: null,
    surname: null,
    email: null,
    tel: null,
    address: null,
    cp: null,
    countryId: null,
    stateId: null,
    cityId: null,
    carrierId: null,
    paymentMethodId: null,
    countries: [],
    states: [],
    cities: [],
    carriers: [],
    discounts: [],
    paymentMethods: [],
    shipping: 0,
    subtotal: Cart.total(),
    discount: 0,
    total: Cart.total(),
    carrierLoading: false,
    creating: false
  }),
  watch: {
    countryId: async function (countryId) {
      this.states = [{ id: null, name: 'Cargando...' }];
      this.stateId = null;
      
      const st = await State.get(countryId);
      this.states = st.data.states;
      this.updateShipping();
    },
    stateId: async function (stateId) {
      this.cities = [{ id: null, name: 'Cargando...' }];
      this.cityId = null;
      
      const st = await City.get(stateId);
      this.cities = st.data.cities;
      this.updateShipping();
    },
    cityId: async function () {
      this.carrierLoading = true;
      this.carriers = [];
      
      const st = await Carrier.get(this.stateId, this.cityId);
      this.carriers = st.data.carriers;
      this.carrierLoading = false;
      
      this.updateShipping();
    },
    carrierId: function () {
      this.updateShipping();
    }
  },
  async created() {
    this.products = Cart.products();
    this.discounts = Cart.discounts();
    
    const pm = await PaymentMethod.get();
    this.paymentMethods = pm.data.paymentMethods;

    const ct = await Country.get();
    this.countries = ct.data.countries;
    this.countryId = this.countries[0].id;
    
    if (this.discounts.length > 0) {
      this.loadTotals();
    }
  },
  methods: {
    async loadTotals() {
      const params = {
        products: this.products.map(product => ({ id: product.productId, versionId: product.versionId, quantity: product.quantity })),
        discounts: this.discounts
      };
      
      if (this.stateId) {
        params.stateId = this.stateId;
      }
      
      if (this.cityId) {
        params.cityId = this.cityId;
      }
      
      if (this.carrierId) {
        params.carrierId = this.carrierId;
      }

      try {
        const data = await Order.calculateTotal(params);      
  
        this.discount = data.data.discount;
        this.shipping = data.data.shipping;
        this.subtotal = data.data.subtotal;
        this.total = data.data.total;      
      } catch (error) {
        this.$nuxt.$emit('error', error.response.data.error);
        throw error;
      }
    },
    updateQuantity(index) {
      Cart.updateProducts(this.products);
    },
    addQuantity(index, qty) {
      this.products[index].quantity = parseInt(this.products[index].quantity) + parseInt(qty);
      if (this.products[index].quantity < 1) {
        this.products[index].quantity = 1;
      }
      if (this.products[index].quantity > this.products[index].stock) {
        this.products[index].quantity = this.products[index].stock;
      }
      Cart.updateProducts(this.products);
    },
    updateShipping() {
      if (!this.countryId || !this.stateId || !this.cityId || !this.carrierId) {
        return false;
      }
      
      this.loadTotals();
    },
    async addDiscount() {
      this.discounts.push(this.newDiscount);

      try {        
        await this.loadTotals();
        Cart.addDiscount(this.newDiscount);
      } catch (error) {
        this.discounts = Cart.discounts();
      }
      
      this.newDiscount = '';
    },
    newOrder() {
      this.creating = true;
      
      if (!this.carrierId) {
        return this.$nuxt.$emit('error', 'Debes seleccionar una forma de envío.');
      }
      
      if (!this.paymentMethodId) {
        return this.$nuxt.$emit('error', 'Debes seleccionar una forma de pago.');
      }
      
      Order.create({
        name: this.name,
        surname: this.surname,
        email: this.email,
        tel: this.tel,
        address: this.address,
        cp: this.cp,
        countryId: this.countryId,
        stateId: this.stateId,
        cityId: this.cityId,
        carrierId: this.carrierId,
        paymentMethodId: this.paymentMethodId,
        products: this.products.map(product => ({ id: product.productId, versionId: product.versionId, quantity: product.quantity })),
        discounts: this.discounts
      }).then((res) => {
        this.$router.push(`pedidos/${res.data.id}`);
      }).catch((error) => {
        this.$nuxt.$emit('error', error.response.data.error);
      }).then(() => {
        this.creating = false;
      });
    }
  }
};
</script>
