import express from 'express';
import browserSync from 'browser-sync';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from './webpack.config';
import run, { format } from './run';
import clean from './clean';
import { isDebug } from './common';

// https://webpack.js.org/configuration/watch/#watchoptions
const watchOptions = {
  aggregateTimeout: 300,
  poll: 1000
};

function createCompilationPromise(name, compiler, config) {
  return new Promise((resolve, reject) => {
    let timeStart = new Date();
    compiler.hooks.compile.tap(name, () => {
      timeStart = new Date();
      console.info(`[${format(timeStart)}] Compiling '${name}'...`);
    });

    compiler.hooks.done.tap(name, stats => {
      console.info(stats.toString(config.stats));
      const timeEnd = new Date();
      const time = timeEnd.getTime() - timeStart.getTime();
      if (stats.hasErrors()) {
        console.info(
          `[${format(timeEnd)}] Failed to compile '${name}' after ${time} ms`,
        );
        reject(new Error('Compilation failed!'));
      } else {
        console.info(
          `[${format(
            timeEnd,
          )}] Finished '${name}' compilation after ${time} ms`,
        );
        resolve(stats);
      }
    });
  });
}

let server;


/**
 * Launches a development web server with "live reload" functionality -
 * synchronizing URLs, interactions and code changes across multiple devices.
 */
async function start() {
  if (server) return server;
  server = express();
  //server.use(express.static(path.resolve(__dirname, '../public')));

  // Configure client-side hot module replacement
  const clientConfig = webpackConfig.find(config => config.name === 'client');

  // Configure server-side hot module replacement
  const serverConfig = webpackConfig.find(config => config.name === 'server');

  // Configure compilation
  await run(clean);
  const multiCompiler = webpack(webpackConfig);
  const clientCompiler = multiCompiler.compilers.find(
    compiler => compiler.name === 'client',
  );
  const serverCompiler = multiCompiler.compilers.find(
    compiler => compiler.name === 'server',
  );
  const clientPromise = createCompilationPromise(
    'client',
    clientCompiler,
    clientConfig,
  );
  const serverPromise = createCompilationPromise(
    'server',
    serverCompiler,
    serverConfig,
  );

  server.use(
    webpackDevMiddleware(clientCompiler, {
      publicPath: clientConfig.output.publicPath,
      watchOptions
    }),
  );

  server.use(webpackHotMiddleware(clientCompiler, {
    log: false,
    heartbeat: 2000
  }));

  let appPromise;
  let appPromiseResolve;
  let appPromiseIsResolved = true;

  serverCompiler.hooks.compile.tap('server', () => {
    if (!appPromiseIsResolved) return;
    appPromiseIsResolved = false;
    appPromise = new Promise(resolve => (appPromiseResolve = resolve));
  });

  let app;
  let listen;

  function expressInit() {
    const srv = require('../build/server').default;
    app = srv.app;
    listen = srv.listen;
  }
  function expressReload() {
    listen.close();
    delete require.cache[require.resolve('../build/server')];
    expressInit();
  }
  server.use((req, res) => {
    appPromise
      .then(() => app.handle(req, res))
      .catch(error => console.error(error));
  });

  function checkForUpdate(fromUpdate) {
    const hmrPrefix = '[\x1b[35mHMR\x1b[0m] ';
    if (!app.hot) {
      throw new Error(`${hmrPrefix}Hot Module Replacement is disabled.`);
    }
    if (app.hot.status() !== 'idle') {
      return Promise.resolve();
    }
    return app.hot
      .check(true)
      .then(updatedModules => {
        if (!updatedModules) {
          if (fromUpdate) {
            console.info(`${hmrPrefix}Update applied.`);
          }
          return;
        }
        if (updatedModules.length === 0) {
          console.info(`${hmrPrefix}Nothing hot updated.`);
        } else {
          console.info(`${hmrPrefix}Updated modules:`);
          updatedModules.forEach(moduleId =>
            console.info(`${hmrPrefix} - ${moduleId}`),
          );
          checkForUpdate(true);
          expressReload();
        }
      })
      .catch(error => {
        if (['abort', 'fail'].includes(app.hot.status())) {
          console.warn(`${hmrPrefix}Cannot apply update.`);
          expressReload();
        } else {
          console.warn(
            `${hmrPrefix}Update failed: ${error.stack || error.message}`,
          );
        }
      });
  }

  serverCompiler.watch(watchOptions, (error, stats) => {
    if (app && !error && !stats.hasErrors()) {
      checkForUpdate().then(() => {
        appPromiseIsResolved = true;
        appPromiseResolve();
      });
    }
  });

  // Wait until both client-side and server-side bundles are ready
  await clientPromise;
  await serverPromise;

  const timeStart = new Date();
  console.info(`[${format(timeStart)}] Launching server...`);
  expressInit();

  appPromiseIsResolved = true;
  appPromiseResolve();
  if (isDebug()) {

    // Launch the development server with Browsersync and HMR
    await new Promise((resolve, reject) =>
      browserSync.create().init(
        {
          // https://www.browsersync.io/docs/options
          server: 'src/server',
          middleware: [server],
          open: false
        },
        (error, bs) => (error ? reject(error) : resolve(bs)),
      ),
    );
  }

  const timeEnd = new Date();
  const time = timeEnd.getTime() - timeStart.getTime();
  console.info(`[${format(timeEnd)}] Server launched after ${time} ms`);
  return server;
}

export default start;
