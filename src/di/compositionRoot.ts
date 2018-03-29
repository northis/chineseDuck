import { IAuthenticationService } from '../services/interfaces';
import container from './inversify.config';
import Types from './types';

const authenticationService = container.get<IAuthenticationService>(Types.IAuthenticationService);

export {authenticationService};
