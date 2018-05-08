import { inject, injectable } from 'inversify';
import * as ST from '../store/types';
import * as I from '../types/interfaces';
import * as AuthTypes from './auth/types';
import * as T from './types';

@injectable()
export default class RootStoreOptions implements T.IStoreOptions {

    public state: ST.IRootState;
    public modules: { auth: AuthTypes.IAuthModule; };

    public constructor(
        @inject(ST.Types.IRootState) rs: ST.IRootState,
        @inject(AuthTypes.Types.IAuthModule) auth: AuthTypes.IAuthModule) {
        this.state = rs;
        this.modules = { auth };
    }
}
