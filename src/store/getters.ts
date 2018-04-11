import { Getter, GetterTree } from 'vuex';
import { IRootState } from '../types/interfaces';

const rs: Getter<IRootState, IRootState> = (state) => {
    return state;
};

const getterTree: GetterTree<IRootState, IRootState> = {
    getRootState : rs,
  };

export default getterTree;
