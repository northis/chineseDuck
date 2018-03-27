import VueRouter from 'vue-router';
import Login from './components/Login.vue';

const router = new VueRouter({
    mode: 'history',
    base: __dirname,
    routes: [
      { path: '/login', component: Login/*, beforeEnter: requireAuth*/ },
      { path: '/logout',
        beforeEnter(to, from, next) {
          // logout
        },
      },
    ],
  });

export default router;
