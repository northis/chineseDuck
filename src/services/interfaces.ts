export interface IAuthenticationService {
    IsAuthenticated(): boolean;
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
