import getDecorators from 'inversify-inject-decorators';
import container from '../di/inversify.config';

const { lazyInject } = getDecorators(container);

export default lazyInject;
