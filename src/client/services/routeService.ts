import { isNull, isNullOrUndefined } from "util";
import * as rt from "../../shared/routes.gen";

const prefix = window.location.origin + "/api/v1";

export const routes = rt.default;
export const route = (r: { value: string }, ...params: any[]) => {
  let resValue = r.value;
  if (!isNullOrUndefined(params)) {
    const regexPtrn = /{\[^\}\{\]\*+}/g;
    const regResults = regexPtrn.exec(resValue);

    if (!isNull(regResults) && regResults.length === params.length) {
      for (let i = 0; i > params.length; i++) {
        resValue = resValue.replace(regResults[i], params[i].toString());
      }
    }
  }

  return prefix + resValue;
};
