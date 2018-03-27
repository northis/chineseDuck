import Vue, { VNode } from 'vue';
import VueRouter from 'vue-router';
import './assets/mainStyles.less';
import App from './components/main/App.vue';
import router from './router';
import storeItem from './store/index';

Vue.use(VueRouter);

class AppCore {
  private instance: Vue;

  constructor() {
    this.instance = new Vue({
      el: '#app',
      router,
      store : storeItem,
      render(createElement): VNode {
        return createElement(App);
      },
  });
  }

}

const v = new AppCore();
