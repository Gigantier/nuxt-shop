<template>
  <div id="register" class="container xsmall">
  
    <h1>Ingresa a tu cuenta</h1>
    
    <form method="post" class="account" @submit.prevent="login">
      <div class="row">
        <div class="field">
          <label>
            E-mail
            <input v-model="email" type="email" name="email" required="required">
          </label>
        </div>
        <div class="field">
          <label>
            Contraseña
            <input v-model="pwd" type="password" name="pwd" required="required">
          </label>
        </div>
      </div>
      
      <p class="tos">¿No tienes cuenta? <router-link to="registro">Regístrate</router-link></p>
      
      <input type="submit" name="login" value="Ingresar" class="button btn btn-primary">
    </form>
    
  </div>
</template>

<script>
import User from '~/components/gigantier/User';

export default {
  name: 'Login',
  data: () => ({
    email: null,
    pwd: null
  }),
  methods: {
    login() {
      this.$nuxt.$loading.start();
      User.login(this.email, this.pwd).then(() => {
        this.$router.push('/');
      }).catch((e) => {
        this.$nuxt.$emit('error', 'Datos inválidos.');
      }).then(() => {
        this.$nuxt.$loading.finish();
      });
    }
  }
};
</script>
