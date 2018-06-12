import { getMode, ModeEnum } from "./common";
import swaggerDoc from "../src/server/api/swagger.json";
import docHash from "../src/shared/routes.hash.json";
import fs from "fs";
import util from "util";
import md5 from "js-md5";

export function overrideRules(rules, patch) {
  return rules.map(ruleToPatch => {
    let rule = patch(ruleToPatch);
    if (rule.rules) {
      rule = { ...rule, rules: overrideRules(rule.rules, patch) };
    }
    if (rule.oneOf) {
      rule = { ...rule, oneOf: overrideRules(rule.oneOf, patch) };
    }
    return rule;
  });
}

export function updateRoutesFromSwagger() {
  let paths = swaggerDoc.paths;
  let actualHash = md5(JSON.stringify(paths));

  if (docHash.hash == actualHash) {
    console.info("Using same routes");
  } else {
    let routesObject = {};
    for (const key of Object.keys(paths)) {
      let methods = paths[key];

      let pathObj = {};
      pathObj.value = key;

      let actions = {};
      Object.keys(methods).map(a => (actions[a] = a));
      pathObj.actions = actions;
      routesObject[key.replace(/[\/{}]/g, "_")] = pathObj;
    }

    fs.writeFileSync(
      "./src/shared/routes.gen.js",
      "export default " + util.inspect(routesObject)
    );

    docHash.hash = actualHash;
    fs.writeFileSync("./src/shared/routes.hash.json", JSON.stringify(docHash));
    console.info("Routes have been changed");
  }
}
