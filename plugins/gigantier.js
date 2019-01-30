import Vue from 'vue'

Vue.prototype.$price = function (price) {
  return `$${Number(price).toLocaleString('es')}`;
}
