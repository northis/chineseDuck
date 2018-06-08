import axios from "axios";
import { inject, injectable } from "inversify";
import * as rt from "../../shared/routes.gen";
import * as E from "../types/enums";
import * as T from "../types/interfaces";

@injectable()
export class AuthService implements T.IAuthenticationService {
  public async SendPhoneNumber(phone: string): Promise<boolean> {
    const result = await axios.post(rt.default._user_auth.value, { phone });

    // result.

    // return await axios.post("", { phone });
    throw new Error("Method not implemented.");
  }

  public async SendCode(code: string): Promise<T.IUser | null> {
    throw new Error("Method not implemented.");
  }
}
