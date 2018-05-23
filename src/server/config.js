if (process.env.BROWSER) {
  throw new Error(
    'Do not import `config.js` from inside the client-side code.'
  );
}

const port = process.env.PORT || 8000;

const nodeJsApp = {
  port,
  api: {
    clientUrl: process.env.API_CLIENT_URL || '',
    serverUrl:
      process.env.API_SERVER_URL ||
      `http://localhost:${port}`,
  },

  databaseUrl: process.env.DATABASE_URL || 'localhost:27017',
  auth: {
    jwt: { secret: process.env.JWT_SECRET || 'No secrets from you' },
  },
};

export default nodeJsApp;
