import { inject, injectable } from 'inversify';
import * as E from '../types/enums';
import * as T from '../types/interfaces';

@injectable()
export class AuthService implements T.IAuthenticationService {
    public async SendPhoneNumber(phone: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    public async SendCode(code: string): Promise<T.IUser | null> {
        throw new Error('Method not implemented.');
    }
}
