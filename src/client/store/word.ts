import axios from "axios";
import { isNullOrUndefined } from "util";
import { ActionContext } from "vuex";
import { route, routes } from "../services/routeService";
import * as I from "../types/interfaces";
import * as ST from "./types";

const mutations = {
  setWords(state: I.IWordState, payload: I.IWord[]): void {
    state.words = payload;
  },
  setLoading(state: I.IWordState, payload: boolean): void {
    state.isLoading = payload;
  }
};

const actions = {
  async fetchWords(
    context: ActionContext<I.IWordState, ST.IRootState>,
    currentFolderId: number
  ): Promise<void> {
    try {
      context.commit(mutations.setLoading.name, true);
      const resp = await axios.get(
        route(routes._word_folder__folderId__count__count_, currentFolderId, 0)
      );
      const data: I.IWord[] = resp.data;

      context.commit(mutations.setWords.name, data);
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    } finally {
      context.commit(mutations.setLoading.name, false);
    }
  }
};

const getters = {
  getWords(state: I.IWordState): I.IWord[] {
    return state.words;
  },
  hasSelectedWords(state: I.IWordState): boolean {
    return !isNullOrUndefined(state.words.find(a => a.isChecked === true));
  },
  isAllSelected(state: I.IWordState): boolean {
    return state.words.every(a => a.isChecked === true);
  },
  isAllUnSelected(state: I.IWordState): boolean {
    return state.words.every(a => a.isChecked !== true);
  },
  isLoading(state: I.IWordState): boolean {
    return state.isLoading;
  }
};

const stateItem: I.IWordState = {
  words: [],
  currentWord: null,
  isLoading: false
};

const word = {
  namespaced: true,

  state: stateItem,
  getters,
  mutations,
  actions
};

export default word;
