import { Container } from 'inversify';
import 'reflect-metadata';
import { Store } from 'vuex';
import * as services from './services';

function configContainer() {

    const container = new Container();
    container.options.autoBindInjectable = true;
    container.options.defaultScope = 'Singleton';

    services.Bind(container);

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
