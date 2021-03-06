import axios from "axios";
import { isNullOrUndefined } from "util";
import { ActionContext } from "vuex";
import { route, routes } from "../services/routeService";
import * as I from "../types/interfaces";
import * as ST from "./types";

const mutations = {
  createFolder(state: I.IFolderState, payload: I.IFolder): void {
    state.folders.unshift(payload);
  },
  setFolders(state: I.IFolderState, payload: I.IFolder[]): void {
    state.folders = payload;
  },
  deleteFolder(state: I.IFolderState, payload: I.IFolder): void {
    const index = state.folders.indexOf(payload, 0);
    if (index > -1) {
      state.folders.splice(index, 1);
    }
  },
  setCurrentFolder(state: I.IFolderState, payload: I.IFolder | null): void {
    state.currentFolder = payload;
  }
};

const actions = {
  async createFolder(
    context: ActionContext<I.IFolderState, ST.IRootState>
  ): Promise<void> {
    if (isNullOrUndefined(context.state.currentFolder)) {
      throw new Error("No items to save");
    }
    context.state.currentFolder.wordsCount = 0;
    await axios.post(route(routes._folder), context.state.currentFolder);
    context.commit(mutations.setCurrentFolder.name, null);
  },

  async saveFolder(
    context: ActionContext<I.IFolderState, ST.IRootState>
  ): Promise<void> {
    if (isNullOrUndefined(context.state.currentFolder)) {
      throw new Error("No items to save");
    }
    const result = await axios.put(
      route(routes._folder__folderId_, context.state.currentFolder._id),
      context.state.currentFolder
    );
    context.state.currentFolder.activityDate = result.data.activityDate;
    context.commit(mutations.setCurrentFolder.name, null);
  },

  async deleteFolder(
    context: ActionContext<I.IFolderState, ST.IRootState>
  ): Promise<void> {
    if (isNullOrUndefined(context.state.currentFolder)) {
      throw new Error("No items to delete");
    }

    await axios.delete(
      route(routes._folder__folderId_, context.state.currentFolder._id)
    );
    context.commit(mutations.deleteFolder.name, context.state.currentFolder);
    context.commit(mutations.setCurrentFolder.name, null);
  },

  async fetchFolders(
    context: ActionContext<I.IFolderState, ST.IRootState>
  ): Promise<void> {
    try {
      const resp = await axios.get(route(routes._folder));

      const data: I.IFolder[] = resp.data;
      context.commit(mutations.setFolders.name, data);
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }
};

const getters = {
  getFolders(state: I.IFolderState): I.IFolder[] {
    return state.folders;
  },

  getCurrentFolder(state: I.IFolderState): I.IFolder | null {
    return state.currentFolder;
  }
};

const stateItem: I.IFolderState = {
  folders: [],
  currentFolder: null
};

const folder = {
  namespaced: true,

  state: stateItem,
  getters,
  mutations,
  actions
};

export default folder;
