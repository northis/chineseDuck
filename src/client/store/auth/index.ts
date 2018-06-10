import axios from "axios";
import { ActionContext, Module } from "vuex";
import * as rt from "../../../shared/routes.gen";
import { Consts } from "../../consts";
import * as E from "../../types/enums";
import * as I from "../../types/interfaces";
import * as ST from "../types";

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
  setUser(state: I.IAuthState, payload: I.IUser): void {
    state.user = payload;
  }
};
const actions = {
  async fetchUser(
    context: ActionContext<I.IAuthState, ST.IRootState>
  ): Promise<I.IUser | null> {
    try {
      const user = localStorage.getItem(Consts.UserKeyString) as I.IUser | null;
      context.commit(mutations.setUser.name, user);
      return Promise.resolve(user);
    } catch (e) {
      return Promise.reject(e);
    }
  },

  async sendPhoneNumber(
    context: ActionContext<I.IAuthState, ST.IRootState>,
    phoneNumber: string
  ): Promise<boolean> {
    try {
      context.state.phone = phoneNumber;

      const result = await axios.post(rt.default._user_auth.value, {
        phoneNumber
      });

      const hash = context.state.hash;
      if (result.status === 200) {
        if (hash === undefined) {
          return Promise.reject("Something went wrong");
        } else {
          context.commit(
            mutations.setAuthState.name,
            result ? E.EAuthStage.PhoneOk : E.EAuthStage.NoAuth
          );
          context.commit(mutations.setAuthState.name, E.EAuthStage.PhoneSent);

          context.state.hash = hash;

          return Promise.resolve(true);
        }
      } else {
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
      const result = null; // await authService.SendCode(code);
      context.commit(
        mutations.setAuthState.name,
        result ? E.EAuthStage.PhoneOk : E.EAuthStage.NoAuth
      );

      const userExist = result != null;
      if (userExist) {
        context.commit(mutations.setUser.name, result);
      }

      context.commit(
        mutations.setAuthState.name,
        userExist ? E.EAuthStage.Auth : E.EAuthStage.NoAuth
      );
      return result;
    } catch (e) {
      context.commit(mutations.setAuthState.name, E.EAuthStage.NoAuth);
      return Promise.reject(e);
    }
  }
};
const getters = {
  isAuthenticated(state: I.IAuthState): boolean {
    return state.user != null;
  },

  getTelMasks(): I.ITelMasks {
    const masksItem = {
      mainCountriesMasks: JSON.parse(
        JSON.stringify(require("../../services/phoneService/masksMain.json"))
      ) as I.IPhoneMask[],
      otherCountriesMasks: JSON.parse(
        JSON.stringify(require("../../services/phoneService/masksOther.json"))
      ) as I.IPhoneMask[]
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
