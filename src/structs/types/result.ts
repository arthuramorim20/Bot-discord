export type TResult<T> =
  | {
      data: T;
      error: null;
    }
  | {
      data: null;
      error: error;
    };
