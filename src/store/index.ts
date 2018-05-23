import Vue from 'vue';
import { Store, StoreOptions } from 'vuex';
import Vuex from 'vuex';
import container from '../di/inversify.config';
import * as ST from '../store/types';
import auth from './auth';

Vue.use(Vuex);
const store: StoreOptions<ST.IRootState> = {
    state: {
        Version: '1.0.0',
        AppName: 'Chinese Duck',
    },
    modules: {
        auth,
    },
};

export default new Vuex.Store<ST.IRootState>(store);
