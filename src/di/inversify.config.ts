import { Container } from 'inversify';
import 'reflect-metadata';
import { AuthService } from '../services/AuthService';
import { LocalStorageService } from '../services/LocalStorageService';
import { PhoneMaskService } from '../services/phoneService';
import * as I from '../types/interfaces';
import RegDictionary from './regDictionary';

import { FAuthService } from '../services/fake/FAuthService';
import { FStorageService } from '../services/fake/FStorageService';

const container = new Container();
container.bind<I.IStorageService>(RegDictionary.IStorageService).to(FStorageService);
container.bind<I.IAuthenticationService>(RegDictionary.IAuthenticationService).to(FAuthService);
container.bind<I.IPhoneMaskService>(RegDictionary.IPhoneMaskService).to(PhoneMaskService);
export default container;
