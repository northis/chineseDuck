import Vue from 'vue';
import Vuex, { StoreOptions  } from 'vuex';
import {auth} from './auth/index';
import getters from './getters';
import {RootState} from './types';

Vue.use(Vuex);
const store: StoreOptions<RootState> = {
    state: {
        version: '1.0.0',
        appName: 'Chinese Duck',
    },
    getters,
    modules: {
        auth,
    },

};

export default new Vuex.Store<RootState>(store);
