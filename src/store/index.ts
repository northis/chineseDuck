import Vuex, { StoreOptions } from 'vuex';
import { IRootState } from '../types/interfaces';
import * as I from '../types/interfaces';
import * as T from './types';
import * as AuthTypes from './auth/types';
import getters from './getters';
import { inject, injectable } from 'inversify';

@injectable()
export class RootStoreOptions implements T.IStoreOptions {

    public state: IRootState;
    public getters: T.IGetters;
    public modules: { authModule: AuthTypes.IAuthModule; };

    public constructor(
        @inject(I.Types.IRootState) rs: IRootState,
        @inject(T.Types.IGetters) gs: T.IGetters,
        @inject(AuthTypes.Types.IAuthModule) authM: AuthTypes.IAuthModule) {
        this.state = rs;
        this.getters = gs;
        this.modules.authModule = authM;
    }
}


@injectable()
export class RootStore implements Vuex.Store<I.IRootState>{

}
