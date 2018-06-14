import axios from "axios";
import * as request from "request";
import { ActionContext } from "vuex";
import { parse } from "../services/jsonPaser";
import { route, routes } from "../services/routeService";
import * as E from "../types/enums";
import * as I from "../types/interfaces";
import * as ST from "./types";

const mutations = {
  setFolders(state: I.IFolderState, payload: I.IFolder[]): void {
    state.folders = payload;
  }
};
const actions = {
  async fetchFolders(
    context: ActionContext<I.IFolderState, ST.IRootState>
  ): Promise<any> {
    try {
      const resp = await axios.get(route(routes._folder));

      const data: I.IFolder[] = resp.data;
      // context.commit(mutations.setFolders.name, data);
    } catch (e) {
      return Promise.reject(e);
    }
  }
};
const getters = {
  getFolders(state: I.IFolderState): I.IFolder[] {
    return state.folders;
  }
};

const folder = {
  namespaced: true,

  state: {
    folders: []
  },
  getters,
  mutations,
  actions
};

export default folder;
