import { inject, injectable } from 'inversify';
import * as ST from '../store/types';
import * as I from './interfaces';

@injectable()
export class RootState implements ST.IRootState {
    private version: string;
    private appName: string;

    public constructor(@inject(I.Types.TVersion)version: string,
                       @inject(I.Types.TAppName)appName: string) {
        this.version = version;
        this.appName = appName;
    }

    get Version() {
        return this.version;
    }
    get AppName() {
        return this.appName;
    }
}
