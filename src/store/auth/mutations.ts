import { injectable } from 'inversify';
import { Mutation, MutationTree } from 'vuex';
import { Handler } from 'vuex-typescript';
import * as E from '../../types/enums';
import * as I from '../../types/interfaces';
import * as T from './types';


@injectable()
export class Mutations implements T.IMutations {

    public onFetchTelMasks: T.IMutation<I.IAuthState, (state: I.IAuthState, payload: I.ITelMasks) => void>;

    [key: string]: (state: I.IAuthState, payload: any) => any;

    constructor()
    {
        this.onFetchTelMasks = (state, payload) => {state.telMasks = payload; };
    }
 
    @Handler
    public onFetchUser(state: I.IAuthState, payload: I.IUser): void {
        state.user = payload;
    }
    @Handler
    public onLogOut(state: I.IAuthState): void {
        state.user = null;
        state.stage = E.EAuthStage.NoAuth;
    }
    @Handler
    public onSetAuthState(state: I.IAuthState, payload: E.EAuthStage): void {
        state.stage = payload;
    }
}
