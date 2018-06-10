import * as ST from "../store/types";
import * as I from "./interfaces";

export class RootState implements ST.IRootState {
  private version: string;
  private appName: string;

  public constructor(version: string, appName: string) {
    this.version = version;
    this.appName = appName;
  }

  get Version() {
    return this.version;
  }
  get AppName() {
    return this.appName;
  }
}
