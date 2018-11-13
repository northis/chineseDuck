import { isNullOrUndefined } from "util";

export function e400(res, errorText) {
  e(res, 400, errorText);
}
export function e401(res, errorText) {
  e(res, 401, errorText);
}
export function e403(res, errorText) {
  e(res, 403, errorText);
}
export function e404(res, errorTextText) {
  e(res, 404, errorTextText);
}
export function e500(res, errorTextText) {
  e(res, 500, errorTextText);
}

function e(res, eNum, errorTextText) {
  res.status(eNum).send(errorTextText || eNum);
}
