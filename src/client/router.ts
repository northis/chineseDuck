import Vue from "vue";
import VueRouter from "vue-router";
import LogoutModule from "./components/Logout.vue";
import AppModule from "./components/main/App.vue";
import store from "./store";
import auth from "./store/auth";
import * as ST from "./store/types";

export const routerInit = async () => {
  try {
    await store.dispatch(`${ST.Modules.auth}/${auth.actions.fetchUser.name}`);
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.info("Authentication required.");
  }

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

  const isAuthGetter = `${ST.Modules.auth}/${
    auth.getters.isAuthenticated.name
  }`;
  router.beforeEach((to, from, next) => {
    const isAuth = store.getters[isAuthGetter] as boolean;
    if (to.path.toLocaleLowerCase().includes("/login")) {
      if (isAuth) {
        next("/");
      } else {
        next();
      }
    } else {
      if (isAuth) {
        next();
      } else {
        next("/login");
      }
    }
  });

  return router;
};
