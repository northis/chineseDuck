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

export function isDebug() {
  return getMode() !== ModeEnum.Production;
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
  phone: "+79200000000",
  phone_code: 43312,
  password_hash: "$2b$10$xkwscjZQ.KM3uf1ZG2totO8RRfASADnADfyGNn6t3R5XDva0HKQ3y",
  password: "5lJnlNrgDjeu"
};

export const Settings = {
  mongoDbString: "mongodb://apiUser:qipassword@localhost:27017/chineseDuck",
  port: 3000,
  sessionsPass: "2%$&epZvC$dA_Hsd"
};
