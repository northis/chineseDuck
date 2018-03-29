import { Module } from 'vuex';
import { RootState } from '../types';
import * as T from './types';

const state: T.IAuthState = {
    user : {
        id: 0,
        name: '',
        key: '',
    },
    stage : T.AuthStage.NoAuth,
};
export const auth: Module<T.IAuthState, RootState> = {
    state,
};
