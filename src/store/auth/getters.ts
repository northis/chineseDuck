import { injectable } from 'inversify';
import { Getter, GetterTree } from 'vuex';
import { Handler } from 'vuex-typescript';
import * as I from '../../types/interfaces';
import * as ST from '../types';
import * as T from './types';

@injectable()
export class Getters implements T.IGetters {
    [key: string]: Getter<I.IAuthState, ST.IRootState>;

    @Handler
    public isAuthenticated(state: I.IAuthState): boolean {
        return state.user != null;
    }
}
