import { Container } from 'inversify';
import { AuthService } from '../services/AuthService';
import { FAuthService } from '../services/fake/FAuthService';
import { FStorageService } from '../services/fake/FStorageService';
import { LocalizeService } from '../services/localizeService';
import { LocalStorageService } from '../services/LocalStorageService';
import { PhoneMaskService } from '../services/phoneService';
import * as I from '../types/interfaces';

export function Bind(container: Container) {
    container.bind<I.IStorageService>(I.Types.IStorageService).to(LocalStorageService);
    container.bind<I.IAuthenticationService>(I.Types.IAuthenticationService).to(FAuthService);
    container.bind<I.IPhoneMaskService>(I.Types.IPhoneMaskService).to(PhoneMaskService);
    container.bind<I.ILocalizeService>(I.Types.ILocalizeService).to(LocalizeService);
}
