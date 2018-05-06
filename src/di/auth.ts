import { Container } from 'inversify';
import * as T from '../store/auth/types';
import { Mutations } from '../store/auth/mutations';
import { Actions } from '../store/auth/actions';
import { Getters } from '../store/auth/getters';
import * as AuthTypes from '../store/auth/types';
import * as AuthClass from '../store/auth';

export function Bind(container: Container) {
    container.bind<T.IMutations>(T.Types.IMutations).to(Mutations);
    container.bind<T.IActions>(T.Types.IActions).to(Actions);
    container.bind<T.IGetters>(T.Types.IGetters).to(Getters);
    container.bind<AuthTypes.IAuthModule>(T.Types.IGetters).to(AuthClass.AuthModule); 
}