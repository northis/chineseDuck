import { inject, injectable } from 'inversify';
import { Action, ActionContext, ActionTree } from 'vuex';
// import { Handler } from 'vuex-typescript';
import { Consts } from '../../consts';
import * as I from '../../types/interfaces';
import * as ST from '../types';
import * as T from './types';

function keeper() {
    // Actions fields are initiated
}

@injectable()
export class Actions implements T.IActions {

    public fetchTelMasks: { handler: (context: ActionContext<I.IAuthState, ST.IRootState>) => Promise<I.ITelMasks>; } =
        {
            handler: ((context: ActionContext<I.IAuthState, ST.IRootState>) => {
                try {
                    // tslint:disable-next-line:no-debugger
                    debugger;
                    const masksItem: I.ITelMasks = {
                        mainCountriesMasks: this.fields.maskService.GetMainCountries(),
                        otherCountriesMasks: this.fields.maskService.GetOtherCountries(),
                    };
                    context.commit(this.fields.mutations.onFetchTelMasks.name, masksItem);
                    return Promise.resolve(masksItem);
                } catch (e) {
                    return Promise.reject(e);
                }
            }).bind(this),
        };

    private fields: {
        handler: () => void,
        maskService: I.IPhoneMaskService;
        storageService: I.IStorageService;
        authService: I.IAuthenticationService;
        mutations: T.IMutations;
    };

    public constructor(@inject(I.Types.IPhoneMaskService) maskService: I.IPhoneMaskService,
                       @inject(I.Types.IStorageService) storageService: I.IStorageService,
                       @inject(I.Types.IAuthenticationService) authService: I.IAuthenticationService,
                       @inject(T.Types.IMutations) mutations: T.IMutations) {
        this.fields = {
            handler: keeper,
            maskService,
            storageService,
            authService,
            mutations,
        };
    }

    [key: string]: Action<I.IAuthState, ST.IRootState>;

    public async fetchUser(context: ActionContext<I.IAuthState, ST.IRootState>): Promise<I.IUser | null> {
        try {
            const user = this.fields.storageService.GetValue(Consts.UserKeyString) as I.IUser | null;
            context.commit(this.fields.mutations.onFetchUser.name, user);
            return Promise.resolve(user);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    public async sendPhoneNumber(
        context: ActionContext<I.IAuthState, ST.IRootState>, phoneNumber: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.fields.authService.SendPhoneNumber(phoneNumber)
                .then(res => {
                    context.commit(this.fields.mutations.onSendPhoneNumber.name, res);
                    resolve(res);
                }, reject);
        });
    }

    public async sendCode(context: ActionContext<I.IAuthState, ST.IRootState>, code: string): Promise<I.IUser | null> {
        return new Promise<I.IUser | null>((resolve, reject) => {
            this.fields.authService.SendCode(code)
                .then(res => {
                    // context.commit(this.fields.mutations..name, res);
                    resolve(res);
                }, reject);
        });
    }
}
