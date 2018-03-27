import Vue from 'vue';
import Vuex, { StoreOptions  } from 'vuex';
import getters from './getters';
import {RootState} from './types';

Vue.use(Vuex);
const store: StoreOptions<RootState> = {
    state: {
        version: '1.0.0',
        appName: 'Chinese Duck',
    },
    getters,
};

export default new Vuex.Store<RootState>(store);
