import { EAuthStage } from './enums';

export interface IAuthState {
    user: IUser | null;
    stage: EAuthStage;
    saveAuth: boolean;
    telMasks: ITelMasks | null;
}

export interface ILocalizeService {
  t(key: string): string;
}

export interface ITelMasks {
    mainCountriesMasks: IPhoneMask[];
    otherCountriesMasks: IPhoneMask[] | null;
}

export interface IUser {
    id: number;
    name: string;
    key: string;
}

export interface IAuthenticationService {
    SendPhoneNumber(phoneNumber: string): Promise<boolean>;
    SendCode(code: string): Promise<IUser | null>;
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
    Version: string;
    AppName: string;
}

export const Types = {
    IStorageService: Symbol('IStorageService'),
    IAuthenticationService: Symbol('IAuthenticationService'),
    IPhoneMaskService: Symbol('IPhoneMaskService'),
    ILocalizeService: Symbol('ILocalizeService'),
    IRootState: Symbol('IRootState'),
    TVersion: Symbol('TVersion'),
    TAppName: Symbol('TAppName'),
};