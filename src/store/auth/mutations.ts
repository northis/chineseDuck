import { MutationTree } from 'vuex';
import * as E from '../../types/enums';
import * as I from '../../types/interfaces';
import * as T from './types';
import { injectable } from 'inversify';

@injectable()
export class Mutations implements T.IMutations {
    [key: string]: (state: I.IAuthState, payload: any) => any;
    public onFetchTelMasks(state: I.IAuthState, payload: I.ITelMasks): void {
        state.telMasks = payload;
    }
    public onFetchUser(state: I.IAuthState, payload: I.IUser): void {
        state.user = payload;
    }
    public onLogOut(state: I.IAuthState): void {
        state.user = null;
        state.stage = E.EAuthStage.NoAuth;
    }
    public onSetAuthState(state: I.IAuthState, payload: E.EAuthStage): void {
        state.stage = payload;
    }
}

