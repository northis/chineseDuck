import { get, getAll, isEnabled } from "tiny-cookie";

export const IsAuthenticated = () => {
  return isEnabled() && get("connect.sid") !== null;
};
