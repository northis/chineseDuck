import "bootstrap";
import Vue from "vue";
import VueI18n from "vue-i18n";
import VueRouter from "vue-router";
import "./assets/styles/mainStyles.scss";
import App from "./components/main/App.vue";
import { routerInit } from "./router";
import * as storeItem from "./store";

// include factory methods here for testing purposes

const createVue = (router: VueRouter) => {
  const instance = new Vue({
    el: "#app",
    router,
    store: storeItem.default
  });
};

routerInit().then(createVue);
