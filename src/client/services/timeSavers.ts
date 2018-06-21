import { isNullOrUndefined } from "util";

export const formatError = (e: any): string => {
  if (isNullOrUndefined(e)) {
    return "No error";
  }

  if (isNullOrUndefined(e.response)) {
    if (isNullOrUndefined(e.message)) {
      return "An error was occured";
    }
    return e.message.toString();
  }

  if (isNullOrUndefined(e.response.data)) {
    if (isNullOrUndefined(e.response.statusText)) {
      return e.response.toString();
    }
    return e.response.statusText.toString();
  }
  if (isNullOrUndefined(e.response.data.error)) {
    return e.response.data.toString();
  }
  return e.response.data.error.toString();
};
