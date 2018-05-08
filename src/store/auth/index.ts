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
    onFetchTelMasks(state: I.IAuthState, payload: I.ITelMasks): void {
        state.telMasks = payload;
    },

    onFetchUser(state: I.IAuthState, payload: I.IUser): void {
        state.user = payload;
    },
    onLogOut(state: I.IAuthState): void {
        state.user = null;
        state.stage = E.EAuthStage.NoAuth;
    },
    onSetAuthState(state: I.IAuthState, payload: E.EAuthStage): void {
        state.stage = payload;
    },
    onSetUser(state: I.IAuthState, payload: I.IUser): void {
        state.user = payload;
    },
};
const actions = {
    async fetchTelMasks(context: ActionContext<I.IAuthState, ST.IRootState>): Promise<I.ITelMasks> {
        try {
            const masksItem: I.ITelMasks = {
                mainCountriesMasks: maskService.GetMainCountries(),
                otherCountriesMasks: maskService.GetOtherCountries(),
            };
            context.commit(mutations.onFetchTelMasks.name, masksItem);
            return Promise.resolve(masksItem);
        } catch (e) {
            return Promise.reject(e);
        }
    },

    async fetchUser(context: ActionContext<I.IAuthState, ST.IRootState>): Promise<I.IUser | null> {
        try {
            const user = storageService.GetValue(Consts.UserKeyString) as I.IUser | null;
            context.commit(mutations.onFetchUser.name, user);
            return Promise.resolve(user);
        } catch (e) {
            return Promise.reject(e);
        }
    },

    async sendPhoneNumber(
        context: ActionContext<I.IAuthState, ST.IRootState>, phoneNumber: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            authService.SendPhoneNumber(phoneNumber)
                .then(res => {
                    context.commit(mutations.onSetAuthState.name, res ? E.EAuthStage.PhoneOk : E.EAuthStage.NoAuth);
                    resolve(res);
                }, reject);
        });
    },

    async sendCode(context: ActionContext<I.IAuthState, ST.IRootState>, code: string): Promise<I.IUser | null> {
        return new Promise<I.IUser | null>((resolve, reject) => {
            authService.SendCode(code)
                .then(res => {
                    const userExist = res != null;
                    if (userExist) {
                        context.commit(mutations.onSetUser.name, res);
                    }

                    context.commit(mutations.onSetAuthState.name, userExist
                        ? E.EAuthStage.Auth : E.EAuthStage.NoAuth);
                    resolve(res);
                }, reject);
        });
    },
};
const getters = {
    isAuthenticated(state: I.IAuthState): boolean {
        return state.user != null;
    },
};

const auth = {
    namespaced: true,

    state: {
        user: null,
        stage: E.EAuthStage.NoAuth,
        saveAuth: false,
        telMasks: null,
    },
    getters,
    mutations,
    actions,
};

export default auth;
