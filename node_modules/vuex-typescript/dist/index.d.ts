import { ActionContext, Store } from "vuex";
export declare function Handler(target: any, key: string): void;
/**
 * Vuex getter handler specified in Vuex options.
 */
export declare type GetterHandler<TModuleState, TRootState, TResult> = (state: TModuleState, rootState: TRootState) => TResult;
/**
 * Vuex action handler which takes payload as specified in Vuex options.
 */
export declare type ActionHandlerWithPayload<TModuleState, TRootState, TPayload, TResult> = (injectee: ActionContext<TModuleState, TRootState>, payload: TPayload) => void | Promise<TResult>;
/**
 * Vuex action handler which does not take payload as specified in Vuex options.
 */
export declare type ActionHandlerNoPayload<TModuleState, TRootState, TResult> = (injectee: ActionContext<TModuleState, TRootState>) => void | Promise<TResult>;
/**
 * Vuex mutation handler which takes payload as specified in Vuex options.
 */
export declare type MutationHandlerWithPayload<TModuleState, TPayload> = (state: TModuleState, payload: TPayload) => void;
/**
 * Vuex mutation handler which does not take payload as specified in Vuex options.
 */
export declare type MutationHandlerNoPayload<TModuleState> = (state: TModuleState) => void;
/**
 * Function which gets value of a concrete Vuex getter.
 */
export declare type GetAccessor<TModuleState, TRootState, TResult> = (store: Store<TRootState> | ActionContext<TModuleState, TRootState>) => TResult;
/**
 * Function which dispatches a concrete Vuex action with payload.
 */
export declare type DispatchAccessorWithPayload<TModuleState, TRootState, TPayload, TResult> = (store: Store<TRootState> | ActionContext<TModuleState, TRootState>, payload: TPayload) => Promise<TResult>;
/**
 * Function which dispatches a concrete Vuex action without payload.
 */
export declare type DispatchAccessorNoPayload<TModuleState, TRootState, TResult> = (store: Store<TRootState> | ActionContext<TModuleState, TRootState>) => Promise<TResult>;
/**
 * Function which commits a concrete Vuex mutation with payload.
 */
export declare type CommitAccessorWithPayload<TModuleState, TRootState, TPayload> = (store: Store<TRootState> | ActionContext<TModuleState, TRootState>, payload: TPayload) => void;
/**
 * Function which commits a concrete Vuex mutation without payload.
 */
export declare type CommitAccessorNoPayload<TModuleState, TRootState> = (store: Store<TRootState> | ActionContext<TModuleState, TRootState>) => void;
export interface StoreAccessors<TModuleState, TRootState> {
    /**
     * Returns a function committing mutations directed to the specified mutation handler.
     * This overload is for handlers which do not expect payload.
     */
    commit(handler: MutationHandlerNoPayload<TModuleState>): CommitAccessorNoPayload<TModuleState, TRootState>;
    /**
     * Returns a function committing mutations directed to the specified mutation handler.
     * This overload is for handlers which expect payload.
     */
    commit<TPayload>(handler: MutationHandlerWithPayload<TModuleState, TPayload>): CommitAccessorWithPayload<TModuleState, TRootState, TPayload>;
    /**
     * Returns a function dispatching actions directed to the specified action handler.
     * This overload is for handlers which do not expect payload.
     */
    dispatch<TResult>(handler: ActionHandlerNoPayload<TModuleState, TRootState, TResult>): DispatchAccessorNoPayload<TModuleState, TRootState, TResult>;
    /**
     * Returns a function dispatching actions directed to the specified action handler.
     * This overload is for handlers which expect payload.
     */
    dispatch<TPayload, TResult>(handler: ActionHandlerWithPayload<TModuleState, TRootState, TPayload, TResult>): DispatchAccessorWithPayload<TModuleState, TRootState, TPayload, TResult>;
    /**
     * Returns a function returning value of the specified getter.
     */
    read<TResult>(handler: GetterHandler<TModuleState, TRootState, TResult>): GetAccessor<TModuleState, TRootState, TResult>;
}
export declare function getStoreAccessors<TModuleState, TRootState>(namespace: string): StoreAccessors<TModuleState, TRootState>;
