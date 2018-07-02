import { ITelMasks } from "../../types/interfaces";

export class LoginVM {
  public CurrentMask: string = "";
  public IsPhoneReady: boolean = false;
  public IsCodeReady: boolean = false;
  public UserTel: string = "";
  public UserCode: string = "";
  public SaveAuth: boolean = false;
  public FirstFocusCountry: boolean = true;
  public FirstFocusPhone: boolean = true;
  public FirstFocusCode: boolean = true;
  public CommonError: string = "";
  public telMasks: ITelMasks | null;
}
