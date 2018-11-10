import { isNull, isNullOrUndefined } from "util";
import * as rt from "../../shared/routes.gen";

// const prefix = window.location.origin + "/api/v1";
const prefix = "/api/v1";

const reqexMatches = function*(ptrnStr: RegExp, inputStr: string) {
  let match: RegExpExecArray | null = null;

  // tslint:disable-next-line:no-conditional-assignment
  while ((match = ptrnStr.exec(inputStr)) != null) {
    yield match[0];
  }
};

export const routes = rt.default;
export const route = (r: { value: string }, ...params: any[]) => {
  let resValue = r.value;
  if (!isNullOrUndefined(params)) {
    const routeRegexPattern = /\{[^}{]*\}/g;
    const regResults = Array.from(reqexMatches(routeRegexPattern, resValue));

    if (!isNull(regResults) && regResults.length === params.length) {
      for (let i = 0; i < params.length; i++) {
        resValue = resValue.replace(regResults[i], params[i].toString());
      }
    }
  }

  return prefix + resValue;
};
