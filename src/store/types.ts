import { StoreOptions, GetterTree } from 'vuex';
import * as I from '../types/interfaces';
import * as T from './auth/types';

export interface IGetters extends GetterTree<I.IRootState, I.IRootState> {
    getRootState(state: I.IRootState): boolean;
}

export interface IStoreOptions extends StoreOptions<I.IRootState> {
    state: I.IRootState,
    getters: IGetters,
    modules: {
        authModule: T.IAuthModule,
    },
}

export const Types = {
    IStoreOptions: Symbol('IStoreOptions'),
    IGetters: Symbol('IGetters')
};
