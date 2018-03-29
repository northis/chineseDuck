import { inject, injectable } from 'inversify';
import Types from '../di/types';
import * as T from './interfaces';

@injectable()
export class AuthService implements T.IAuthenticationService {
    public static StorageKey: string = 'UserKey';
    private userKey: string | null;
    private storage: T.IStorageService;

    constructor(@inject(Types.IStorageService)storage: T.IStorageService) {
        this.storage = storage;
        this.UpdateStorageKey();
    }

    public UpdateStorageKey(): void {
        this.userKey = this.storage.GetValue(AuthService.StorageKey);
    }

    public IsAuthenticated(): boolean {
        return this.storage.GetValue(AuthService.StorageKey) != null;
    }
}
