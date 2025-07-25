import type { Context } from "hono";
import { z } from "zod";

type Schemas = {
  body?: z.ZodType;
  query?: z.ZodType;
  params?: z.ZodType;
};

export const validateRequestParts = async (
  c: Context,
  schemas: Schemas
): Promise<{
  body?: any;
  query?: any;
  params?: any;
}> => {
  const result: any = {};
  if (schemas.body) {
    const json = await c.req.json();
    result.body = schemas.body.parse(json);
  }
  if (schemas.query) {
    result.query = schemas.query.parse(c.req.query());
  }
  if (schemas.params) {
    result.params = schemas.params.parse(c.req.param());
  }
  return result;
};
