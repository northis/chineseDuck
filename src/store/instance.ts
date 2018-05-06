import container from '../di/inversify.config';
import * as I from '../types/interfaces';
import * as ST from '../store/types';
import Vue from 'vue';
import Vuex from 'vuex';

const storeOptions = container.get<ST.IStoreOptions>(ST.Types.IStoreOptions);

Vue.use(Vuex);

export default new Vuex.Store<I.IRootState>(storeOptions);