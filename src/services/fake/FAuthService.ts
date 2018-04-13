import { inject, injectable } from 'inversify';
import RegDictionary from '../../di/regDictionary';
import * as E from '../../types/enums';
import * as T from '../../types/interfaces';

@injectable()
export class FAuthService implements T.IAuthenticationService {
    public static StorageKey: string = 'UserKey';
    private userKey: string | null;
    private storage: T.IStorageService;

    constructor(@inject(RegDictionary.IStorageService) storage: T.IStorageService) {
        this.storage = storage;
        // this.storage.SetValue(FAuthService.StorageKey, '');
    }

    public IsAuthenticated(): boolean {
        return this.storage.GetValue(FAuthService.StorageKey) != null;
    }

    public async SendPhoneNumber(phone: string): Promise<E.EAuthStage> {
        await this.delay(1000);
        return E.EAuthStage.PhoneOk;
    }

    public async SendCode(code: string): Promise<E.EAuthStage> {
        await this.delay(1000);
        this.storage.SetValue(FAuthService.StorageKey, 'FakeKey');
        return E.EAuthStage.Auth;
    }

    private delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
