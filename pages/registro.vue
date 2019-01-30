<template>
  <div id="register" class="container xsmall">
    <h1>Crea tu cuenta</h1>
    <form class="account" method="post" @submit.prevent="register">
      <div class="row">
        <div class="field">
          <label>
            Nombre
            <input v-model="name" name="name" required="required" type="text">
          </label>
        </div>
        <div class="field">
          <label>
            Apellido
            <input v-model="surname" name="surname" required="required" type="text">
          </label>
        </div>
      </div>
      <div class="row">
        <div class="field">
          <label>
            E-mail
            <input v-model="email" name="email" required="required" type="email">
          </label>
        </div>
        <div class="field">
          <label for="day">Fecha de nacimiento</label>
          <div class="input date">
            <select v-model="day">
              <option disabled="disabled" selected value="">día</option>
              <option v-for="i in 31" :key="i" :value="i">{{ i }}</option>
            </select>
            <select v-model="month">
              <option disabled="disabled" selected value="">mes</option>
              <option v-for="(month, i) in months" :key="i" :value="i">{{ month }}</option>
            </select>
            <select v-model="year">
              <option disabled="disabled" selected value="">año</option>
              <option v-for="i in years" :key="i" :value="i">{{ i }}</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="row">
        <div class="field">
          <label>
            Contraseña
            <input v-model="pwd" name="pwd" required="required" type="password">
          </label>
        </div>
        <div class="field">
          <label>
            Confirmar contraseña
            <input v-model="pwd2" name="pwd2" required="required" type="password">
          </label>
        </div>
      </div>
      
      <p><small>* Mínimo 6 caracteres. Para mayor seguridad, le recomendamos utilizar una combinación de letras y números.</small></p>
      <label class="tos">
        <input name="tos" required="required" type="checkbox" value="1">
        He leído y aceptado los <a href="" target="_blank">términos y condiciones</a>
      </label>
      
      <input class="button btn btn-primary" type="submit" value="Registrarse">
      
    </form>
  </div>
</template>

<script>
import User from '~/components/gigantier/User';

export default {
  name: 'Register',
  data: () => ({
    name: null,
    surname: null,
    email: null,
    day: null,
    month: null,
    year: null,
    pwd: null,
    pwd2: null,
    
    months: [],
    years: [],
    
    errorMessage: null,
    errorVisible: false
  }),
  created() {
    this.months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    for (let i = new Date().getFullYear(); i > 1900; i -= 1) {
      this.years.push(i);
    }
  },
  methods: {
    register() {
      const params = {
        name: this.name,
        surname: this.surname, 
        email: this.email,
        day: this.day,
        month: this.month,
        year: this.year,
        pwd: this.pwd
      };
      
      this.$nuxt.$loading.start()
      
      User.register(params).then(() => {
        return User.login(this.email, this.pwd).then(() => {
          this.$router.push('/');
        });
      }).catch((e) => {
        this.$nuxt.$emit('error', e.response.data.error);
      }).then(() => {
        this.$nuxt.$loading.finish();        
      });
    }
  }
};
</script>
