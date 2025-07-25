import type { Context } from "hono";
import type { ContentfulStatusCode, RedirectStatusCode } from "hono/utils/http-status";

type JsonPossible = | string | number | boolean | null;

type JsonCompatible =
    | JsonPossible
    | { [key: string]: JsonPossible }
    | JsonPossible[];

export type ResponseHelperConfig = {
  defaultOkStatus?: ContentfulStatusCode;
  defaultErrorStatus?: ContentfulStatusCode;
  wrapErrorMessage?: boolean;
  url?: string,
};

export function ResponseFactory (config: Partial<ResponseHelperConfig> = {}) {
  const {
    defaultOkStatus = 200,
    defaultErrorStatus = 500,
    wrapErrorMessage = true,
    url = './',
  } = config;

  const jsonOk = (c: Context, data: JsonCompatible, status?: ContentfulStatusCode) => {
    return c.json(data, status ?? defaultOkStatus);
  };

  const jsonError = (
    c: Context,
    message: string | {},
    status?: ContentfulStatusCode
  ) => {
    const payload =
      typeof message === "string" && wrapErrorMessage
        ? { message }
        : message;

    return c.json(payload, status ?? defaultErrorStatus);
  };

  const defaultRedirect = (c: Context) => {
    return c.redirect(url, 302)
  }

  const redirectTo = (c: Context, url: string, status: RedirectStatusCode = 302) => {
    return c.redirect(url, status);
  };

  return {
    jsonOk,
    jsonError,
    defaultRedirect,
    redirectTo,
  };
};
