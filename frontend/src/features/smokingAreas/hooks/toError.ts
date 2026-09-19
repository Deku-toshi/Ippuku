export const toError = (e: unknown): Error => {
  if (e instanceof Error) {
    return e;
  } else if (e == null) {
    return new Error("Unknown error");
  } else if (typeof e === "string" || typeof e === "number" || typeof e === "boolean") {
    return new Error(String(e));
  } else if (typeof e === "object") {
    const maybeMessageObject = e as { message?: unknown };
    const message = maybeMessageObject.message;
    if (typeof message === "string") {
      return new Error(message);
    }
  }

  return new Error("Unknown error");
};
