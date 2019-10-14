import pkg from "../package.json";

export const ModeEnum = {
  Development: "development",
  Production: "production",
  Test: "test"
};

export function getMode() {
  var indexModeArg = process.argv.indexOf("--mode");
  if (indexModeArg != -1) {
    var mode = process.argv[indexModeArg + 1];
    return mode == undefined ? ModeEnum.Production : mode;
  }
}

let keys = {
  telegramApiId: 0,
  telegramBotKey: "000000000:AAAAAAAAAAAAAA_AAAAAAAAAAAAAAAAAAAA",
  mongoDbString: "mongodb://user:password@localhost:27017/chineseDuck",
  sessionsPass: "pass"
};

if (getMode() !== ModeEnum.Test) {
  try {
    keys = require("../keys.js").Keys;
  } catch (error) {
    console.error(error);
  }
}

export const Keys = keys;

export function isDebug() {
  return getMode() !== ModeEnum.Production;
}
export function isTest() {
  return getMode() === ModeEnum.Test;
}

export function isVerbose() {
  return process.argv.includes("--verbose");
}

export function isAnalyze() {
  return (
    process.argv.includes("--analyze") || process.argv.includes("--analyse")
  );
}

export function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getFooterMarkupLine() {
  return `<p>${pkg.description} - ${pkg.version} | <a href=https://t.me/DeathWhinny>Contact me</a> | <a href=https://t.me/DeathWhinny>GitHub</a> | <a href=/api/docs>Api</a></p>`;
}
export function getFooterMarkup() {
  return `<p>${pkg.description} - ${pkg.version}</p> <p><a href=https://t.me/DeathWhinny>Contact me</a> | <a href=${pkg.homepage}>GitHub</a> | <a href=/api/docs>Api</a></p>`;
}

export const DebugKeys = {
  user_id: 100,
  admin_id: 101,
  other_user_id: 102,
  not_existing_word_id: 1000,
  not_existing_file_id: "0bf1754ff5702c56dc023d5c",
  notAnumber: "notAnumber",
  botKey: keys.telegramBotKey
};

export let Settings = {
  mongoDbString: keys.mongoDbString,
  port: 3000,
  sessionsPass: keys.sessionsPass,
  answersCount: 4,
  serverUserId: 0,
  apiPrefix: "/api/v1/",
  docsPrefix: "/api/docs/",
  getLocalApiAddress: () =>
    `http://localhost:${Settings.port}${Settings.apiPrefix}`
};
