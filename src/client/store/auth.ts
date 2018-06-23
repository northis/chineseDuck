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
    state.hash = null;
    state.phone = null;
  },
  setAuthState(state: I.IAuthState, payload: E.EAuthStage): void {
    state.stage = payload;
  },
  setPhone(state: I.IAuthState, payload: string): void {
    state.phone = payload;
  },
  setPhoneHash(state: I.IAuthState, payload: string): void {
    state.hash = payload;
  },
  setSaveAuth(state: I.IAuthState, payload: boolean): void {
    state.saveAuth = payload;
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
          who: user.data.who
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

  async sendPhoneNumber(
    context: ActionContext<I.IAuthState, ST.IRootState>,
    phone: string
  ): Promise<boolean> {
    try {
      context.commit(auth.mutations.setAuthState.name, E.EAuthStage.PhoneSent);
      context.commit(mutations.setPhone.name, phone);

      const result = await axios.post(route(routes._user_auth), {
        phone
      });

      if (result.status === 200) {
        const hash = result.data.hash;
        if (hash === undefined) {
          return Promise.reject("Something went wrong");
        } else {
          context.commit(mutations.setAuthState.name, E.EAuthStage.PhoneOk);
          context.commit(mutations.setPhoneHash.name, hash);

          return Promise.resolve(true);
        }
      } else {
        context.commit(mutations.logOut.name);
        return Promise.reject(result.statusText);
      }
    } catch (e) {
      context.commit(mutations.logOut.name);
      return Promise.reject(e);
    }
  },

  async sendCode(
    context: ActionContext<I.IAuthState, ST.IRootState>,
    code: string
  ): Promise<I.IUser | null> {
    try {
      context.commit(auth.mutations.setAuthState.name, E.EAuthStage.CodeSent);

      const result = await axios.post(route(routes._user_login), {
        code,
        id: context.state.phone,
        hash: context.state.hash,
        remember: context.state.saveAuth
      });

      if (result.status === 200) {
        return await actions.fetchUser(context);
      }
      return null;
    } catch (e) {
      context.commit(auth.mutations.setAuthState.name, E.EAuthStage.PhoneOk);
      return Promise.reject(e);
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
  }
};
const getters = {
  isAuthenticated(state: I.IAuthState): boolean {
    return state.stage === E.EAuthStage.Auth;
  },

  getTelMasks(): I.ITelMasks {
    const masksItem = {
      mainCountriesMasks: require("../services/phoneService/masksMain.json") as I.IPhoneMask[],
      otherCountriesMasks: require("../services/phoneService/masksOther.json") as I.IPhoneMask[]
    };

    return masksItem;
  }
};

const auth = {
  namespaced: true,

  state: {
    user: null,
    stage: E.EAuthStage.NoAuth,
    saveAuth: false,
    hash: null,
    phone: null
  },
  getters,
  mutations,
  actions
};

export default auth;
