export function e404 (nextFunc){
    e(nextFunc, 404);
}
export function e401 (nextFunc){
    e(nextFunc, 401);
}
export function e403 (nextFunc){
    e(nextFunc, 403);
}
export function e500 (nextFunc){
    e(nextFunc, 500);
}

function e(nextFunc, eNum){
    const myError = new Error();
    myError.status = eNum;
    nextFunc(myError);
}