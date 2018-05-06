import { Getter, GetterTree } from 'vuex';
import { IRootState } from '../types/interfaces';
import { injectable } from 'inversify';
import * as T from './types';

const rs: Getter<IRootState, IRootState> = (state) => {
    return state;
};

const getterTree: GetterTree<IRootState, IRootState> = {
    getRootState : rs,
  };

export default getterTree;


@injectable()
export class Getters implements T.IGetters {
    getRootState(state: IRootState): boolean {
        throw new Error("Method not implemented.");
    }
    [key: string]: Getter<IRootState, IRootState>;

}
