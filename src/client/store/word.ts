import axios from "axios";
import { isNull, isNullOrUndefined } from "util";
import { ActionContext } from "vuex";
import { route, routes } from "../services/routeService";
import * as I from "../types/interfaces";
import * as ST from "./types";

const mutations = {
  setWords(state: I.IWordState, payload: I.IWord[]): void {
    state.words = payload;
  },
  setFile(
    state: I.IWordState,
    payload: { file: I.IWordFile; wordItem: I.IWord }
  ): void {
    payload.wordItem.file = payload.file;
  }
};

const actions = {
  async fetchWordFile(
    context: ActionContext<I.IWordState, ST.IRootState>,
    wordItem: I.IWord
  ) {
    if (
      isNullOrUndefined(wordItem) ||
      isNullOrUndefined(wordItem._id) ||
      !isNullOrUndefined(wordItem.file)
    ) {
      return;
    }

    try {
      const resp = await axios.get(
        route(routes._word__wordId__file__fileTypeId_, wordItem._id, "full")
      );
      const file: I.IWordFile = resp.data;
      context.commit(mutations.setFile.name, { file, wordItem });
      return Promise.resolve(file);
    } catch (e) {
      return Promise.reject(e);
    }
  },

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
