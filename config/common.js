import pkg from "../package.json";
import { isNullOrUndefined } from "util";

let keys = {
  telegramApiId: 0,
  telegramAppKey: "0",
  mongoDbString: "mongodb://user:password@localhost:27017/chineseDuck",
  sessionsPass: "pass"
};

try {
  keys = require("../keys.js").Keys;
} catch (error) {
  console.error(error);
}

export const Keys = keys;

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
export function getFooterMarkupLine() {
  return `<p>${pkg.description} - ${pkg.version} | <a href=${
    pkg.url
  }>Contact me</a> | <a href=${
    pkg.homepage
  }>GitHub</a> | <a href=/api/docs>Api</a></p>`;
}
export function getFooterMarkup() {
  return `<p>${pkg.description} - ${pkg.version}</p> <p><a href=${
    pkg.url
  }>Contact me</a> | <a href=${
    pkg.homepage
  }>GitHub</a> | <a href=/api/docs>Api</a></p>`;
}

export const DebugKeys = {
  phone_code_hash: "06ad2b144ebb09eacd",
  phone: "79200000000",
  phone_code: 43312,
  user_id: 100,
  admin_id: 101,
  not_existing_word_id: 1000,
  password_hash: "$2b$10$xkwscjZQ.KM3uf1ZG2totO8RRfASADnADfyGNn6t3R5XDva0HKQ3y",
  password: "5lJnlNrgDjeu"
};

export const Settings = {
  mongoDbString: keys.mongoDbString,
  port: 3000,
  sessionsPass: keys.sessionsPass,
  apiPrefix: "/api/v1/",
  docsPrefix: "/api/docs/",
  getLocalApiAddress: () =>
    `http://localhost:${Settings.port}${Settings.apiPrefix}`
};
