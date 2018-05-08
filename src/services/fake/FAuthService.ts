import { inject, injectable } from 'inversify';
import * as E from '../../types/enums';
import * as T from '../../types/interfaces';

@injectable()
export class FAuthService implements T.IAuthenticationService {

    public async SendPhoneNumber(phone: string): Promise<boolean> {
        await this.delay(1000);
        return true;
    }

    public async SendCode(code: string): Promise<T.IUser | null> {
        await this.delay(1000);

        return {
            id: 1,
            name: 'Mike',
            key: '2',
        };
    }

    private delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}
