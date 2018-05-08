import Vue from 'vue';
import { Store } from 'vuex';
import Vuex from 'vuex';
import container from '../di/inversify.config';
import * as ST from '../store/types';
import RootStore from './rootStore';

Vue.use(Vuex);

const store = container.get<Store<ST.IRootState>>(ST.Types.RootStore);
export default store;
