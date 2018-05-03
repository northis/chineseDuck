import { Container } from 'inversify';
import * as T from '../store/auth/types';
import { Mutations } from '../store/auth/mutations';
import { Actions } from '../store/auth/actions';

export function Bind(container: Container) {
    container.bind<T.IMutations>(T.Types.IMutations).to(Mutations);
    container.bind<T.IActions>(T.Types.IActions).to(Actions);
}