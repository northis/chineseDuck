import { Module } from 'vuex';
import { phoneMaskService  } from '../../di/compositionRoot';
import * as I from '../../services/interfaces';
import { RootState } from '../types';
import getters from './getters';
import * as T from './types';

const state: T.IAuthState = {
    user : {
        id: 0,
        name: '',
        key: '',
    },
    stage : T.AuthStage.NoAuth,
    saveAuth: false,
    phoneMaskService,
};
export const auth: Module<T.IAuthState, RootState> = {
    state,
    getters,
};
