import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { IRootState } from '../types/interfaces';
import { auth } from './auth/index';
import getters from './getters';

Vue.use(Vuex);
const store: StoreOptions<IRootState> = {
    state: {
        version: '1.0.0',
        appName: 'Chinese Duck',
    },
    getters,
    modules: {
        auth,
    },

};

export default new Vuex.Store<IRootState>(store);
