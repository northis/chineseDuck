import { ActionContext, ActionTree, GetterTree, Module, MutationTree } from 'vuex';
import * as E from '../../types/enums';
import * as T from '../../types/interfaces';

export interface IMutations extends MutationTree<T.IAuthState> {
    onFetchTelMasks(state: T.IAuthState, payload: T.ITelMasks): void;
    onFetchUser(state: T.IAuthState, payload: T.IUser): void;
    onLogOut(state: T.IAuthState): void;
    onSetAuthState(state: T.IAuthState, payload: E.EAuthStage): void;
}

export interface IGetters extends GetterTree<T.IAuthState, T.IRootState> {
    isAuthenticated(state: T.IAuthState): boolean;
}

export interface IActions extends ActionTree<T.IAuthState, T.IRootState> {
    fetchTelMasks(context: ActionContext<T.IAuthState, T.IRootState>): Promise<T.ITelMasks>;
    fetchUser(context: ActionContext<T.IAuthState, T.IRootState>): Promise<T.IUser | null>;
    sendPhoneNumber(context: ActionContext<T.IAuthState, T.IRootState>, phoneNumber: string): Promise<boolean>;
    sendCode(context: ActionContext<T.IAuthState, T.IRootState>, code: string): Promise<T.IUser | null>;
}

export interface IAuthModule extends Module<T.IAuthState, T.IRootState> {
    actions: IActions;
    getters: IGetters;
    mutations: IMutations;
    state: T.IAuthState;
}

export const Types = {
    IAuthModule: Symbol('IAuthModule'),
    IActions: Symbol('IActions'),
    IMutations: Symbol('IMutations'),
    IGetters: Symbol('IGetters'),
};
