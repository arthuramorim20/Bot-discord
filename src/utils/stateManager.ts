import { TResult } from "@/structs/types/result";

export class StateManager {
  constructor() {
    this.userSessions = new Map();
  }

  public startSession(): <TResult<any>> {
    return;
  };

  public getSession(): <TResult<any>> {
    return;
  };

  updateSession() {
    return;
  };
}
