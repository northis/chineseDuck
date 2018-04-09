import { Getter, GetterTree } from 'vuex';
import { RootState } from '../types';
import * as T from './types';

const getPhoneMaskService: Getter<T.IAuthState, RootState> = (state) => {
    return state.phoneMaskService;
};

const getterTree: GetterTree<T.IAuthState, RootState> = {
    getPhoneMaskService,
  };

export default getterTree;
