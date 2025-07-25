import type { Context } from "hono";

export const defaultErrorResponse = <T>(c: Context, errors: (T | null)[]) => {
  return errors.find(e => e) || c.json({ message: 'Unexpected Error' }, 500);
};
