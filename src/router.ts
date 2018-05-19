import Vue from 'vue';
import VueRouter, { Route } from 'vue-router';
import { getStoreAccessors } from 'vuex-typescript';
import LogoutModule from './components/Logout.vue';
import AppModule from './components/main/App.vue';
import container from './di/inversify.config';
import store from './store';
import auth from './store/auth';
import * as ST from './store/types';
import * as I from './types/interfaces';

const LoginModule = () => import('./components/Login.vue');

Vue.use(VueRouter);
const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes: [
    { path: '/login', component: LoginModule/*, beforeEnter: requireAuth*/ },
    { path: '/', component: AppModule },
    { path: '/logout', component: LogoutModule },
    // { path: '/bar', props: { id: 123 }},
    { path: '*', redirect: '/' },
  ],
});

store.dispatch(`${ST.Modules.auth}/${auth.actions.fetchUser.name}`);

const isAuthGetter = `${ST.Modules.auth}/${auth.getters.isAuthenticated.name}`;
router.beforeEach((to, from, next) => {
const isAuth = store.getters[isAuthGetter] as boolean;
if (to.path.toLocaleLowerCase().includes('/login') && !isAuth) {
    next();
  } else {
    if (isAuth) {
      next();
    } else {
      next('/login');
    }
  }
});

export default router;
