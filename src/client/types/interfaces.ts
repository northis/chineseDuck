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

export interface IWordState {
  words: IWord[];
  currentWord: IWord | null;
}

export interface ITelMasks {
  mainCountriesMasks: IPhoneMask[];
  otherCountriesMasks: IPhoneMask[] | null;
}

export interface IUser {
  id: number;
  name: string;
  who: string;
  currentFolder_id: number;
}

export interface IFolder {
  _id?: number;
  name: string;
  activityDate?: Date;
  wordsCount?: number;
}

export interface IWord {
  _id?: number;
  owner_id?: number;
  originalWord: string;
  pronunciation: string;
  translation: string;
  usage?: string;
  activityDate?: Date;
  syllablesCount: number;
  folder_id: number;
  lastModified?: Date;
  score: IScore;
}

export interface IScore {
  originalWordCount: number;
  originalWordSuccessCount: number;
  lastView: Date;
  lastLearned: Date;
  lastLearnMode: string;
  isInLearnMode: boolean;
  rightAnswerNumber: number;
  pronunciationCount: number;
  pronunciationSuccessCount: number;
  translationCount: number;
  translationSuccessCount: number;
  viewCount: number;
  name: string;
}

export interface IPhoneMask {
  m: string;
  n: string;
}
