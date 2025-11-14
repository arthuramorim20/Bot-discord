import { TResult } from "@/structs/types/result";

type SessionState = {
  num1: number | null;
  num2: number | null;
  userId: string;
};

export class StateManager {
  private userSessions: Map<string, SessionState>;

  constructor() {
    this.userSessions = new Map();
  }

  createSession(messageId: string, userId: string): TResult<SessionState> {
    if (!messageId) {
      return { data: null, error: new Error("Missing messageId.") };
    }

    if (this.userSessions.has(messageId)) {
      return { data: null, error: new Error("Session already exists.") };
    }

    const state: SessionState = {
      num1: null,
      num2: null,
      userId,
    };

    this.userSessions.set(messageId, state);

    return { data: state, error: null };
  }

  getSession(messageId: string): TResult<SessionState> {
    if (!messageId) {
      return { data: null, error: new Error("Missing messageId.") };
    }

    const state = this.userSessions.get(messageId);

    if (!state) {
      return { data: null, error: new Error("Session not found.") };
    }

    return { data: state, error: null };
  }

  updateSession<T extends keyof Omit<SessionState, "userId">>(
    messageId: string,
    key: T,
    value: SessionState[T],
  ): TResult<SessionState> {
    if (!messageId) {
      return { data: null, error: new Error("Missing messageId.") };
    }

    const sessionResult = this.getSession(messageId);

    if (sessionResult.error || !sessionResult.data) {
      return { data: null, error: sessionResult.error };
    }

    const session = sessionResult.data;

    session[key] = value;

    return { data: session, error: null };
  }

  deleteState(messageId: string): TResult<null> {
    if (!messageId) {
      return { data: null, error: new Error("Missing messageId.") };
    }

    this.userSessions.delete(messageId);

    return { data: null, error: null };
  }
}
