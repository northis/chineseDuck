import { Action, Mutation, Getter } from "vuex";

export interface ActionTree<S, R> {
    [key: string]: Action<S, R>;
  }

  export interface MutationTree<S> {
    [key: string]: Mutation<S>;
  }

  export interface GetterTree<S, R> {
    [key: string]: Getter<S, R>;
  }