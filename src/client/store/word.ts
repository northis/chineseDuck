import axios from "axios";
import { isNull, isNullOrUndefined } from "util";
import { ActionContext } from "vuex";
import { route, routes } from "../services/routeService";
import * as I from "../types/interfaces";
import * as ST from "./types";

const mutations = {
  setWords(state: I.IWordState, payload: I.IWord[]): void {
    state.words = payload;
  }
};

const actions = {
  async fetchWords(
    context: ActionContext<I.IWordState, ST.IRootState>,
    currentFolderId: number
  ): Promise<void> {
    try {
      const resp = await axios.get(
        route(routes._word_folder__folderId_, currentFolderId)
      );
      const data: I.IWord[] = resp.data;

      context.commit(mutations.setWords.name, data);
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }
};

const getters = {
  getWords(state: I.IWordState): I.IWord[] {
    return state.words;
  }
};

const stateItem: I.IWordState = {
  words: [],
  currentWord: null
};

const word = {
  namespaced: true,

  state: stateItem,
  getters,
  mutations,
  actions
};

export default word;
