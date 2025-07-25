import type { Context } from "hono";
import { z } from "zod";

export const parseJsonInputSchema = async <T extends z.ZodType>(
  c: Context,
  schema: T
): Promise<z.infer<T>> => {
  const inputValues = await c.req.json();
  return schema.parse(inputValues);
};


export const parseParams = <T extends z.ZodType>(c: Context, schema: T) => {
  return schema.parse(c.req.param());
}

export const parseQuery = <T extends z.ZodType>(c: Context, schema: T) => {
  return schema.parse(c.req.query());
}
