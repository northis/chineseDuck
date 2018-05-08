import { Action, ActionContext, ActionTree, GetterTree, Module, Mutation, MutationTree } from 'vuex';
import * as E from '../../types/enums';
import * as T from '../../types/interfaces';
import * as ST from '../types';

export interface IMutations extends MutationTree<T.IAuthState> {

    onFetchTelMasks: IMutation<T.IAuthState, (state: T.IAuthState, payload: T.ITelMasks) => void>;
   // onFetchTelMasks(state: T.IAuthState, payload: T.ITelMasks): void;
    onFetchUser(state: T.IAuthState, payload: T.IUser): void;
    onLogOut(state: T.IAuthState): void;
    onSetAuthState(state: T.IAuthState, payload: E.EAuthStage): void;
}

export interface IGetters extends GetterTree<T.IAuthState, ST.IRootState> {
    isAuthenticated(state: T.IAuthState): boolean;
}

export interface IActions extends ActionTree<T.IAuthState, ST.IRootState> {
    fetchTelMasks: {handler: (context: ActionContext<T.IAuthState, ST.IRootState>) => Promise<T.ITelMasks>};
    fetchUser(context: ActionContext<T.IAuthState, ST.IRootState>): Promise<T.IUser | null>;
    sendPhoneNumber(context: ActionContext<T.IAuthState, ST.IRootState>, phoneNumber: string): Promise<boolean>;
    sendCode(context: ActionContext<T.IAuthState, ST.IRootState>, code: string): Promise<T.IUser | null>;
}

export interface IAuthModule extends Module<T.IAuthState, ST.IRootState> {
    actions: IActions;
    getters: IGetters;
    mutations: IMutations;
    state: T.IAuthState;
}

export interface IMutation<S, H> extends Mutation<S> {
    handler: H;
}

export const Types = {
    IAuthModule: Symbol('IAuthModule'),
    IActions: Symbol('IActions'),
    IMutations: Symbol('IMutations'),
    IGetters: Symbol('IGetters'),
};
