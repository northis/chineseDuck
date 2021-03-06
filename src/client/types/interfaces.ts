import { EAuthStage } from "./enums";

export interface IAuthState {
  user: IUser | null;
  stage: EAuthStage;
  saveAuth: boolean;
  hash: string | null;
  phone: string | null;
}

export interface ITelegramUser {
  first_name: string | null;
  last_name: string | null;
  id: number;
  username: string | null;
}

export interface IFolderState {
  folders: IFolder[];
  currentFolder: IFolder | null;
}

export interface IWordState {
  words: IWord[];
  currentWord: IWord | null;
  isLoading: boolean;
  newFolderId: number;
  currentFolderId: number;
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

export interface IWordFile {
  height: number;
  width: number;
  createDate: Date;
  id: string;
}
export interface IFile {
  id: string;
  bytes: Buffer;
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
  isChecked: boolean;
}

export interface IScore {
  originalWordCount: number;
  originalWordSuccessCount: number;
  lastView: Date;
  lastLearned: Date;
  lastLearnMode: string;
  rightAnswerNumber: number;
  pronunciationCount: number;
  pronunciationSuccessCount: number;
  translationCount: number;
  translationSuccessCount: number;
  viewCount: number;
  name: string;
}
