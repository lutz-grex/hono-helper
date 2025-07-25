import type { Context } from "hono";
import { z } from "zod";
import { parseJsonInputSchema } from "../validation";

export const executeEndpointWithSchema = async <
  Schema extends z.ZodType,
  Response,
  ErrorResponse
>(
  context: Context,
  schema: Schema,
  handler: (value: z.infer<Schema>) => Promise<Response>,
  errorHandler: (e: unknown) => ErrorResponse,
): Promise<Response | ErrorResponse> => {
  const value = await parseJsonInputSchema(context, schema);
  try {
    return await handler(value);
  } catch (e) {
    return errorHandler(e);
  }
};
