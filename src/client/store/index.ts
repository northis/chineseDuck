import Vue from "vue";
import { StoreOptions } from "vuex";
import Vuex from "vuex";
import * as ST from "../store/types";
import auth from "./auth";
import folder from "./folder";
import word from "./word";

Vue.use(Vuex);
const store: StoreOptions<ST.IRootState> = {
  state: {
    Version: "1.0.0",
    AppName: "Chinese Duck"
  },
  modules: {
    auth,
    folder,
    word
  }
};

export default new Vuex.Store<ST.IRootState>(store);
