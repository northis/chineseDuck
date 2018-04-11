import { Getter, GetterTree } from 'vuex';
import * as T from '../../types/interfaces';

const getPhoneMaskService: Getter<T.IAuthState, T.IRootState> = (state) => {
    return state.phoneMaskService;
};

const getterTree: GetterTree<T.IAuthState, T.IRootState> = {
    getPhoneMaskService,
  };

export default getterTree;
