import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import moment from 'moment'
import './css/styles.scss'
import './assets/svg/symbols.svg'
import './assets/Mercedes-Logo.png'

// inject moment so it can be globally referenced
Vue.prototype.$moment = moment;

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});