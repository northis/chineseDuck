import { inject, injectable } from 'inversify';
import * as T from '../../types/interfaces';

@injectable()
export class PhoneMaskService implements T.IPhoneMaskService {

    private mainItems: T.IPhoneMask[];
    private otherItems: T.IPhoneMask[];

    constructor() {
        this.mainItems = JSON.parse(JSON.stringify(require('./masksMain.json')));
        this.otherItems = JSON.parse(JSON.stringify(require('./masksOther.json')));
    }

    public GetOtherCountries(): T.IPhoneMask[] {
        return this.otherItems;
    }

    public GetMainCountries(): T.IPhoneMask[] {
        return this.mainItems;
    }
}
