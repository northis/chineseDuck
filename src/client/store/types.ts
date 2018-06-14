import { GetterTree, Store, StoreOptions } from "vuex";
import * as I from "../types/interfaces";

export interface IRootState {
  Version: string;
  AppName: string;
}

export const Modules = {
  auth: "auth",
  folder: "folder"
};
