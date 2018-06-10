import { EAuthStage } from "./enums";

export interface IAuthState {
  user: IUser | null;
  stage: EAuthStage;
  saveAuth: boolean;
  hash: string | null;
  phone: string | null;
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

export interface IPhoneMask {
  m: string;
  n: string;
}
