import { Container } from 'inversify';
import 'reflect-metadata';
import * as C from '../types/classes';
import * as I from '../types/interfaces';
import * as auth from './auth';
import * as services from './services';
import * as ST from '../store/types';
import * as StoreClass from '../store';

const container = new Container();
container.bind<I.IRootState>(I.Types.IRootState).to(C.RootState);

container.bind<ST.IStoreOptions>(ST.Types.IStoreOptions).to(StoreClass.RootStoreOptions);

auth.Bind(container);
services.Bind(container);

container.bind<string>(I.Types.TAppName).toConstantValue('Chinese Duck');
container.bind<string>(I.Types.TVersion).toConstantValue('1.0.0');

export default container;
