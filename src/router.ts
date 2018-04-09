import VueRouter, { Route } from 'vue-router';
import AppModule from './components/main/App.vue';
import { authenticationService } from './di/compositionRoot';

const LoginModule = () => import('./components/Login.vue');

const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes: [
    { path: '/login', component: LoginModule/*, beforeEnter: requireAuth*/ },
    { path: '/', component: AppModule/*, beforeEnter: requireAuth*/ },
    // { path: '/bar', props: { id: 123 }},
    { path: '*', redirect: '/' },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.path.toLocaleLowerCase().includes('/login')) {
    next();
  } else {
    const isAuth = authenticationService.IsAuthenticated();
    if (isAuth) {
      next();
    } else {
      next('/login');
    }
  }
});

export default router;
