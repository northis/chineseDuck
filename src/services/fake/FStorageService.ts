import { injectable } from 'inversify';
import * as C from 'typescript-collections';
import * as T from '../interfaces';

@injectable()
export class FStorageService implements T.IStorageService {

    private storage: C.Dictionary<string, string>;

    public constructor() {
        this.storage = new C.Dictionary<string, string>();
    }

    public GetValue(key: string): string | null {
        return this.storage.getValue(key) as string;
    }
    public SetValue(key: string, value: string): void {
        this.storage.setValue(key, value);
    }
    public DeleteValue(key: string): void {
        this.storage.remove(key);
    }
}
