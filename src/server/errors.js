import { isNullOrUndefined } from "util";

export function e400(res, nextFunc, errorText) {
  e(res, nextFunc, 400, errorText);
}
export function e401(res, nextFunc, errorText) {
  e(res, nextFunc, 401, errorText);
}
export function e403(res, nextFunc, errorText) {
  e(res, nextFunc, 403, errorText);
}
export function e404(res, nextFunc, errorTextText) {
  e(res, nextFunc, 404, errorText);
}
export function e500(res, nextFunc, errorTextText) {
  e(res, nextFunc, 500, errorText);
}

function e(res, nextFunc, eNum, errorTextText) {
  res.status(eNum).send(errorTextText || eNum);
  nextFunc();
}
