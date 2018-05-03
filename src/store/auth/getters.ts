import { Getter, GetterTree } from 'vuex';
import * as I from '../../types/interfaces';
import * as T from './types';
import { injectable } from 'inversify';

@injectable()
export class Getters implements T.IGetters {
    [key: string]: Getter<I.IAuthState, I.IRootState>;

    public isAuthenticated(state: I.IAuthState): boolean {
        return state.user != null;
    }
}

