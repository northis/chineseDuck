import { inject, injectable } from 'inversify';
import { ActionContext, Module } from 'vuex';
import { Consts } from '../../consts';
import container from '../../di/inversify.config';
import * as E from '../../types/enums';
import * as I from '../../types/interfaces';
import * as ST from '../types';

const maskService = container.get<I.IPhoneMaskService>(I.Types.IPhoneMaskService);
const storageService = container.get<I.IStorageService>(I.Types.IStorageService);
const authService = container.get<I.IAuthenticationService>(I.Types.IAuthenticationService);

const mutations = {
    logOut(state: I.IAuthState): void {
        state.user = null;
        state.stage = E.EAuthStage.NoAuth;
    },
    setAuthState(state: I.IAuthState, payload: E.EAuthStage): void {
        state.stage = payload;
    },
    setUser(state: I.IAuthState, payload: I.IUser): void {
        state.user = payload;
    },
};
const actions = {
    async fetchUser(context: ActionContext<I.IAuthState, ST.IRootState>): Promise<I.IUser | null> {
        try {
            const user = storageService.GetValue(Consts.UserKeyString) as I.IUser | null;
            context.commit(mutations.setUser.name, user);
            return Promise.resolve(user);
        } catch (e) {
            return Promise.reject(e);
        }
    },

    async sendPhoneNumber(
        context: ActionContext<I.IAuthState, ST.IRootState>, phoneNumber: string): Promise<boolean> {
        try {
            const result = await authService.SendPhoneNumber(phoneNumber);
            context.commit(mutations.setAuthState.name, result ? E.EAuthStage.PhoneOk : E.EAuthStage.NoAuth);

            return result;
        } catch (e) {
            context.commit(mutations.setAuthState.name, E.EAuthStage.NoAuth);
            return Promise.reject(e);
        }
    },

    async sendCode(context: ActionContext<I.IAuthState, ST.IRootState>, code: string): Promise<I.IUser | null> {
        try {
            const result = await authService.SendCode(code);
            context.commit(mutations.setAuthState.name, result ? E.EAuthStage.PhoneOk : E.EAuthStage.NoAuth);

            const userExist = result != null;
            if (userExist) {
                context.commit(mutations.setUser.name, result);
            }

            context.commit(mutations.setAuthState.name, userExist
                ? E.EAuthStage.Auth : E.EAuthStage.NoAuth);
            return result;

        } catch (e) {
            context.commit(mutations.setAuthState.name, E.EAuthStage.NoAuth);
            return Promise.reject(e);
        }
    },
};
const getters = {
    isAuthenticated(state: I.IAuthState): boolean {
        return state.user != null;
    },

    getTelMasks(): I.ITelMasks {
        const masksItem  = {
            mainCountriesMasks: maskService.GetMainCountries(),
            otherCountriesMasks: maskService.GetOtherCountries(),
        };

        return masksItem;
    },
};

const auth = {
    namespaced: true,

    state: {
        user: null,
        stage: E.EAuthStage.NoAuth,
        saveAuth: false,
    },
    getters,
    mutations,
    actions,
};

export default auth;
