import { Module } from 'vuex';
import { authService, phoneMaskService } from '../../di/compositionRoot';
import * as E from '../../types/enums';
import * as T from '../../types/interfaces';
import getters from './getters';

const state: T.IAuthState = {
    user: {
        id: 0,
        name: '',
        key: '',
    },
    stage: E.EAuthStage.NoAuth,
    saveAuth: false,
    phoneMaskService,
    authService,
};
export const auth: Module<T.IAuthState, T.IRootState> = {
    state,
    getters,
};
