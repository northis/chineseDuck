import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import container from '../di/inversify.config';
import { IRootState } from '../types/interfaces';
import * as T from '../types/interfaces';
import * as AuthTypes from './auth/types';
import getters from './getters';

const rState = container.get<T.IRootState>(T.Types.IRootState);
const authModule = container.get<AuthTypes.IAuthModule>(AuthTypes.Types.IAuthModule);

Vue.use(Vuex);
const store: StoreOptions<IRootState> = {
    state: rState,
    getters,
    modules: {
        authModule,
    },
};

export default new Vuex.Store<IRootState>(store);
