import { GetterTree, Store, StoreOptions } from 'vuex';
import * as I from '../types/interfaces';
import * as T from './auth/types';

export interface IStoreOptions extends StoreOptions<IRootState> {
    state: IRootState;
    modules: {
        auth: T.IAuthModule,
    };
}

export interface IRootState {
    Version: string;
    AppName: string;
}

export const Types = {
    IStoreOptions: Symbol('IStoreOptions'),
    IGetters: Symbol('IGetters'),
    IRootState: Symbol('IRootState'),
    RootStore: Symbol('RootStore'),
};

export const Modules = {
    auth: 'auth',
};
