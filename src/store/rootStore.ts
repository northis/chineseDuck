import { decorate, inject, injectable } from 'inversify';
import { Store } from 'vuex';
import * as ST from '../store/types';
import * as I from '../types/interfaces';

decorate(injectable(), Store);

@injectable()
export default class RootStore extends Store<ST.IRootState> {

    public constructor(
        @inject(ST.Types.IStoreOptions) stOpt: ST.IStoreOptions) {
            super(stOpt);
    }
}
