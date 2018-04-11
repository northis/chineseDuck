import { EAuthStage } from './enums';

export interface IAuthState {
    user: IUser;
    stage: EAuthStage;
    saveAuth: boolean;
    phoneMaskService: IPhoneMaskService;
    authService: IAuthenticationService;
}

export interface IUser {
    id: number;
    name: string;
    key: string;
}

export interface IAuthenticationService {
    IsAuthenticated(): boolean;
    SendCode(code: string): Promise<EAuthStage>;
}
export interface IStorageService {
    GetValue(key: string): string | null;
    SetValue(key: string, value: string): void;
    DeleteValue(key: string): void;
}

export interface IPhoneMaskService {
    GetMainCountries(): IPhoneMask[];
    GetOtherCountries(): IPhoneMask[];
}

export interface IPhoneMask {
    m: string;
    n: string;
}

export interface IRootState {
    version: string;
    appName: string;
}
