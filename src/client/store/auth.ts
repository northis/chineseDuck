import axios from "axios";
import { isNullOrUndefined } from "util";
import { ActionContext } from "vuex";
import { route, routes } from "../services/routeService";
import * as E from "../types/enums";
import * as I from "../types/interfaces";
import * as ST from "./types";

const mutations = {
  logOut(state: I.IAuthState): void {
    state.user = null;
    state.stage = E.EAuthStage.NoAuth;
  },
  setAuthState(state: I.IAuthState, payload: E.EAuthStage): void {
    state.stage = payload;
  },
  setUser(state: I.IAuthState, payload: I.IUser): void {
    state.user = payload;
  }
};
const actions = {
  async fetchUser(
    context: ActionContext<I.IAuthState, ST.IRootState>
  ): Promise<I.IUser | null> {
    try {
      const user = await axios.get(route(routes._user), {
        headers: {
          "Cache-Control": "no-cache"
        }
      });
      if (!isNullOrUndefined(user.data.id)) {
        const localUser = {
          id: user.data.id,
          name: user.data.name,
          who: user.data.who,
          currentFolder_id: user.data.currentFolder_id
        };
        context.commit(mutations.setUser.name, localUser);
        context.commit(mutations.setAuthState.name, E.EAuthStage.Auth);
        return Promise.resolve(localUser);
      }
      return Promise.resolve(null);
    } catch (e) {
      context.commit(mutations.logOut.name);
      return Promise.resolve(null);
    }
  },

  async logout(
    context: ActionContext<I.IAuthState, ST.IRootState>
  ): Promise<boolean> {
    try {
      await axios.get(route(routes._user_logout), {
        headers: {
          "Cache-Control": "no-cache"
        }
      });
      context.commit(mutations.logOut.name);
      return Promise.resolve(false);
    } catch (e) {
      return Promise.reject(e);
    }
  },

  async setUserCurrentFolder(
    context: ActionContext<I.IAuthState, ST.IRootState>,
    payload: I.IFolder
  ): Promise<void> {
    if (
      isNullOrUndefined(payload) ||
      isNullOrUndefined(payload._id) ||
      isNullOrUndefined(context.state.user)
    ) {
      throw new Error("No items to update");
    }

    await axios.put(route(routes._user_currentFolder__folderId_, payload._id));

    context.state.user.currentFolder_id = payload._id;
    context.commit(mutations.setUser.name, context.state.user);
  }
};
const getters = {
  isAuthenticated(state: I.IAuthState): boolean {
    return state.stage === E.EAuthStage.Auth;
  }
};

const auth = {
  namespaced: true,

  state: {
    user: null,
    stage: E.EAuthStage.NoAuth
  },
  getters,
  mutations,
  actions
};

export default auth;
