import { EAuthStage } from "./enums";

export interface IAuthState {
  user: IUser | null;
  stage: EAuthStage;
  saveAuth: boolean;
  hash: string | null;
  phone: string | null;
}

export interface IFolderState {
  folders: IFolder[];
  currentFolder: IFolder | null;
}

export interface ITelMasks {
  mainCountriesMasks: IPhoneMask[];
  otherCountriesMasks: IPhoneMask[] | null;
}

export interface IUser {
  id: number;
  name: string;
  who: string;
}

export interface IFolder {
  _id?: number;
  name: string;
  activityDate?: Date;
  wordsCount?: number;
}

export interface IPhoneMask {
  m: string;
  n: string;
}
