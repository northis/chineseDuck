import { Container } from 'inversify';
import 'reflect-metadata';
import { Store } from 'vuex';
import RootStore from '../store/rootStore';
import RootStoreOptions from '../store/rootStoreOptions';
import * as ST from '../store/types';
import * as C from '../types/classes';
import * as I from '../types/interfaces';
import * as auth from './auth';
import * as services from './services';

function configContainer() {

    const container = new Container();
    container.options.autoBindInjectable = true;
    container.options.defaultScope = 'Singleton';

    container.bind<ST.IRootState>(ST.Types.IRootState).to(C.RootState);

    container.bind<ST.IStoreOptions>(ST.Types.IStoreOptions).to(RootStoreOptions);
    container.bind<Store<ST.IRootState>>(ST.Types.RootStore).to(RootStore);

    auth.Bind(container);
    services.Bind(container);

    container.bind<string>(I.Types.TAppName).toConstantValue('Chinese Duck');
    container.bind<string>(I.Types.TVersion).toConstantValue('1.0.0');

    return container;
}

export class DI {

    private static instance: DI;
    private container: Container;

    private constructor() {
        this.container = configContainer();
    }

    public static get Instance() {
        return this.instance || (this.instance = new this());
    }

    public get Container(): Container {
        return DI.Instance.container;
    }
}

const containerInstance = DI.Instance.Container;
export default containerInstance;
