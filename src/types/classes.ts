import { inject, injectable } from 'inversify';
import * as I from './interfaces';

@injectable()
export class RootState implements I.IRootState {
    private version: string;
    private appName: string;
    private authService: I.IAuthenticationService;
    private storageService: I.IStorageService;
    private phoneMaskService: I.IPhoneMaskService;
    private localizeService: I.ILocalizeService;

    public constructor(@inject(I.default.IAuthenticationService) authService: I.IAuthenticationService,
                       @inject(I.default.ILocalizeService) localizeService: I.ILocalizeService,
                       @inject(I.default.IPhoneMaskService) phoneMaskService: I.IPhoneMaskService,
                       @inject(I.default.IStorageService) storageService: I.IStorageService,
                       @inject(I.default.TVersion)version: string,
                       @inject(I.default.TAppName)appName: string) {
        this.authService = authService;
        this.localizeService = localizeService;
        this.phoneMaskService = phoneMaskService;
        this.storageService = storageService;
        this.version = version;
        this.appName = appName;
    }

    get Version() {
        return this.version;
    }
    get AppName() {
        return this.appName;
    }
    get AuthService() {
        return this.authService;
    }
    get StorageService() {
        return this.storageService;
    }
    get PhoneMaskService() {
        return this.phoneMaskService;
    }
    get LocalizeService() {
        return this.localizeService;
    }
}
