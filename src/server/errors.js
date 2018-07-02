export function e400(nextFunc, error) {
  e(nextFunc, 400, error);
}
export function e401(nextFunc, error) {
  e(nextFunc, 401, error);
}
export function e403(nextFunc, error) {
  e(nextFunc, 403, error);
}
export function e404(nextFunc, error) {
  e(nextFunc, 404, error);
}
export function e500(nextFunc, error) {
  e(nextFunc, 500, error);
}

function e(nextFunc, eNum, error) {
  const myError = error ? error : new Error();
  myError.status = eNum;
  nextFunc(myError);
}
