import { inject, injectable } from 'inversify';
import { ActionContext, ActionTree } from 'vuex';
import { Consts } from '../../consts';
import * as I from '../../types/interfaces';
import * as T from './types';

@injectable()
export class Actions implements T.IActions {

    private maskService: I.IPhoneMaskService;
    private storageService: I.IStorageService;
    private authService: I.IAuthenticationService;
    private mutations: T.IMutations;

    public constructor(@inject(I.Types.IPhoneMaskService) maskService: I.IPhoneMaskService,
                       @inject(I.Types.IStorageService) storageService: I.IStorageService,
                       @inject(I.Types.IAuthenticationService) authService: I.IAuthenticationService,
                       @inject(T.Types.IMutations) mutations: T.IMutations) {
        this.maskService = maskService;
        this.storageService = storageService;
        this.authService = authService;
        this.mutations = mutations;
    }

    [key: string]: any;

    public async fetchTelMasks(context: ActionContext<I.IAuthState, I.IRootState>): Promise<I.ITelMasks> {
        try {
            const masksItem: I.ITelMasks = {
                mainCountriesMasks: this.maskService.GetMainCountries(),
                otherCountriesMasks: this.maskService.GetOtherCountries(),
            };
            context.commit(this.mutations.onFetchTelMasks.name, masksItem);
            return Promise.resolve(masksItem);
        } catch (e) {
            return Promise.reject(e);
        }
    }
    public async fetchUser(context: ActionContext<I.IAuthState, I.IRootState>): Promise<I.IUser | null> {
        try {
            const user = this.storageService.GetValue(Consts.UserKeyString) as I.IUser | null;
            context.commit(this.mutations.onFetchUser.name, user);
            return Promise.resolve(user);
        } catch (e) {
            return Promise.reject(e);
        }
    }
    public async sendPhoneNumber(
        context: ActionContext<I.IAuthState, I.IRootState>, phoneNumber: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.authService.SendPhoneNumber(phoneNumber)
                .then(res => {
                    context.commit(this.mutations.onSendPhoneNumber.name, res);
                    resolve(res);
                }, reject);
        });
    }
    public async sendCode(context: ActionContext<I.IAuthState, I.IRootState>, code: string): Promise<I.IUser | null> {
        return new Promise<I.IUser | null>((resolve, reject) => {
            this.authService.SendCode(code)
                .then(res => {
                    context.commit(this.mutations.onSendCode.name, res);
                    resolve(res);
                }, reject);
        });
    }
}
