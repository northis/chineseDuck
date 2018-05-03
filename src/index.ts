import 'bootstrap';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import './assets/styles/mainStyles.scss';
import App from './components/main/App.vue';
import routerItem from './router';
import storeItem from './store/index';

const instance = new Vue({
  el: '#app',
  router: routerItem,
  store: storeItem,
});
