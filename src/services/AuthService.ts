import { inject, injectable } from 'inversify';
import RegDictionary from '../di/regDictionary';
import * as E from '../types/enums';
import * as T from '../types/interfaces';

@injectable()
export class AuthService implements T.IAuthenticationService {
    public static StorageKey: string = 'UserKey';
    private userKey: string | null;
    private storage: T.IStorageService;

    constructor(@inject(RegDictionary.IStorageService)storage: T.IStorageService) {
        this.storage = storage;
        this.UpdateStorageKey();
    }

    public UpdateStorageKey(): void {
        this.userKey = this.storage.GetValue(AuthService.StorageKey);
    }

    public IsAuthenticated(): boolean {
        return this.storage.GetValue(AuthService.StorageKey) != null;
    }

    public SendPhoneNumber(code: string): Promise<E.EAuthStage> {
        throw new Error('Method not implemented.');
    }

    public SendCode(code: string): Promise<E.EAuthStage> {
        throw new Error('Method not implemented.');
    }
}
