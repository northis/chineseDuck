import * as T from '../types/interfaces';
import container from './inversify.config';
import RegDictionary from './regDictionary';

const authService = container.get<T.IAuthenticationService>(RegDictionary.IAuthenticationService);
const phoneMaskService = container.get<T.IPhoneMaskService>(RegDictionary.IPhoneMaskService);

export { authService, phoneMaskService };
