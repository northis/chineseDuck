import { injectable } from 'inversify';
import * as T from './interfaces';

@injectable()
export class LocalStorageService implements T.IStorageService {
    public GetValue(key: string): string | null {
        return localStorage.getItem(key);
    }
    public SetValue(key: string, value: string): void {
        localStorage.setItem(key, value);
    }
    public DeleteValue(key: string): void {
        localStorage.removeItem(key);
    }
}
