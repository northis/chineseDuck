import hotClient from 'webpack-hot-middleware/client';

hotClient.setOptionsAndConnect({
  name: 'client',
  reload: true
});

