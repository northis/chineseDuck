import { Getter, GetterTree } from 'vuex';
import { RootState } from './types';

const rs: Getter<RootState, RootState> = (state) => {
    return state;
};

const getterTree: GetterTree<RootState, RootState> = {
    getRootState : rs,
  };

export default getterTree;
