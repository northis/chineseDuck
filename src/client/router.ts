import Vue from "vue";
import VueRouter, { Route } from "vue-router";
import { getStoreAccessors } from "vuex-typescript";
import LogoutModule from "./components/Logout.vue";
import AppModule from "./components/main/App.vue";
import * as cookies from "./cookies";
import store from "./store";
import auth from "./store/auth";
import * as ST from "./store/types";
import * as I from "./types/interfaces";

const LoginModule = () => import("./components/Login.vue");

Vue.use(VueRouter);
const router = new VueRouter({
  mode: "history",
  base: "/client",
  routes: [
    { path: "/login", component: LoginModule /*, beforeEnter: requireAuth*/ },
    { path: "/", component: AppModule },
    { path: "/logout", component: LogoutModule },
    // { path: '/bar', props: { id: 123 }},
    { path: "*", redirect: "/" }
  ]
});

if (!cookies.IsAuthenticated()) {
  store.commit(`${ST.Modules.auth}/${auth.mutations.logOut.name}`);
}

store.dispatch(`${ST.Modules.auth}/${auth.actions.fetchUser.name}`);

const isAuthGetter = `${ST.Modules.auth}/${auth.getters.isAuthenticated.name}`;
router.beforeEach((to, from, next) => {
  const isAuth = store.getters[isAuthGetter] as boolean;
  if (to.path.toLocaleLowerCase().includes("/login") && !isAuth) {
    next();
  } else {
    if (isAuth) {
      next();
    } else {
      next("/login");
    }
  }
});

export default router;
