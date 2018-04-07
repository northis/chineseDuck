export interface IAuthState {
    user: IUser;
    stage: AuthStage;
    saveAuth: boolean;
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
