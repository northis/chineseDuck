# ChineseDuck

The main web application for the Chinese Duck Bot
And VS Code!

Usage:
npm run build-dev (dev build)
npm run build-prod (production build)
npm run tests (for tests)

To run, create a `keys.js` file in the root of the project folder. The template is like that

```
export const Keys = {

 telegramApiId: 000000,

 telegramAppKey: "00000000000000000",

 mongoDbString: "mongodb://user:password@localhost:27017/chineseDuck",

 sessionsPass: "password"

};

```
