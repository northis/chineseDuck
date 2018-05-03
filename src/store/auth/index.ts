import { inject, injectable } from 'inversify';
import { Module } from 'vuex';
import * as E from '../../types/enums';
import * as I from '../../types/interfaces';
import * as T from './types';

@injectable()
export class AuthModule implements T.IAuthModule {

    public actions: T.IActions;
    public getters: T.IGetters;
    public mutations: T.IMutations;
    public state: I.IAuthState = {
        user: null,
        stage: E.EAuthStage.NoAuth,
        saveAuth: false,
        telMasks: null,
    };

    public constructor(@inject(T.Types.IActions) a: T.IActions,
                       @inject(T.Types.IGetters) g: T.IGetters,
                       @inject(T.Types.IMutations) m: T.IMutations) {
        this.actions = a;
        this.getters = g;
        this.mutations = m;
    }
}
