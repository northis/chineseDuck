import Vue from 'vue';
import VueRouter from 'vue-router';
import './assets/styles/mainStyles.scss';
import App from './components/main/App.vue';
import routerItem from './router';
import storeItem from './store/index';

Vue.use(VueRouter);

const instance = new Vue({
  el: '#app',
  router: routerItem,
  store: storeItem,
});
