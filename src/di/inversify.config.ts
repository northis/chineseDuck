import { Container } from 'inversify';
import 'reflect-metadata';
import { AuthService } from '../services/AuthService';
import * as I from '../services/interfaces';
import { LocalStorageService } from '../services/LocalStorageService';
import { PhoneMaskService } from '../services/phoneService';
import Types from './types';

import { FAuthService } from '../services/fake/FAuthService';
import { FStorageService } from '../services/fake/FStorageService';

const container = new Container();
container.bind<I.IStorageService>(Types.IStorageService).to(FStorageService);
container.bind<I.IAuthenticationService>(Types.IAuthenticationService).to(FAuthService);
container.bind<I.IPhoneMaskService>(Types.IPhoneMaskService).to(PhoneMaskService);
export default container;
