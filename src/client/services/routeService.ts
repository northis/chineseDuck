import * as rt from "../../shared/routes.gen";

const prefix = "/api/v1";

export const routes = rt.default;
export const route = (r: { value: string }) => prefix + r.value;
