import { IPhoneMaskService } from '../../services/interfaces';

export interface IAuthState {
    user: IUser;
    stage: AuthStage;
    saveAuth: boolean;
    phoneMaskService: IPhoneMaskService;
}

export interface IUser {
    id: number;
    name: string;
    key: string;
}

export enum AuthStage {
    NoAuth,
    TelephoneSent,
    CodeSent,
    Auth,
}
