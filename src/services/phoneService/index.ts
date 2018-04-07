import { inject, injectable } from 'inversify';
import Types from '../../di/types';
import * as T from '../interfaces';

@injectable()
export class PhoneMaskService implements T.IPhoneMaskService {

    private mainItems: T.IPhoneMask[];
    private otherItems: T.IPhoneMask[];

    constructor() {
        this.mainItems = JSON.parse(require('./masksMain.json'));
        this.otherItems = JSON.parse(require('./masksOther.json'));
    }

    public GetOtherCountries(): T.IPhoneMask[] {
        return this.mainItems;
    }

    public GetMainCountries(): T.IPhoneMask[] {
        return this.otherItems;
    }
}
