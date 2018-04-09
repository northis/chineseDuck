import * as I from '../services/interfaces';
import container from './inversify.config';
import Types from './types';

const authenticationService = container.get<I.IAuthenticationService>(Types.IAuthenticationService);
const phoneMaskService = container.get<I.IPhoneMaskService>(Types.IPhoneMaskService);

export { authenticationService, phoneMaskService };
