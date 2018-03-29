export interface IAuthState {
    user: IUser;
    stage: AuthStage;
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
