# hono-helper-toolkit

A helper package for building scalable APIs with [Hono](https://hono.dev), [Zod](https://zod.dev), and OpenAPI integration, including useful utilities like rate limiting with Redis support.

---

## Features

- Structured route definitions with automatic validation and error handling
- Easy App generation with OpenAPI documentation
- Middleware helpers (e.g., rate limiter with in-memory or Redis backend)
- Ready-to-use patterns for scalable API development

---

## Usage

### OpenAPI Factory
Create an OpenAPI documentation and route factory:

```typescript
import { OpenAPIHonoFactory } from 'hono-helper-toolkit';

const app = OpenAPIHonoFactory({
  title: 'My API',
  description: 'Automatically generated OpenAPI docs',
  contactName: 'Support Team',
  contactEmail: 'support@example.com',
  licenseName: 'MIT',
  version: '1.0.0',
  port: 3000,
});

// Add routes using .openapi(routeDefinition, handler)

app.listen(3000);
```

### Rate Limiter Middleware
In-memory or Redis-backed rate limiter middleware:

```typescript
import { rateLimiter, setRedisClient } from 'hono-helper-toolkit';
import Redis from 'ioredis';

const redisClient = new Redis();

setRedisClient(new Redis({
  host: localhost,
  port: 6397,
  password: 'secret',
}));

app.use(rateLimiter({
  windowMs: 60000,
  maxRequests: 100,
  headerContent: true,
  redisKeyPrefix: 'key'
}));
```


## API

### OpenAPIHonoFactory(options)
Creates an instance of OpenAPIHono with default docs configured by options.

- `options.title: string` — API title  
- `options.description: string` — API description  
- `options.contactName: string` — Contact person name  
- `options.contactEmail: string` — Contact email  
- `options.licenseName: string` — License name  
- `options.version: string` — API version  
- `options.port: number` — Server port  

> Returns an OpenAPIHono app instance

#### rateLimiter(options)
Creates a rate limiting middleware.

- `windowMs: number` — Time window in milliseconds  
- `maxRequests: number` — Max requests per IP in the window  
- `headerContent: boolean` — Add rate limit headers in responses  
- `redisKeyPrefix: string` — Redis prefix key for data storage  

> Returns a middleware function (ctx, next) => Promise<void>



## Helper Functions Documentation

### executeEndpoint

```ts
export const executeEndpoint = async <Response, ErrorResponse>(
  handler: () => Promise<Response>,
  errorHandler: (e: unknown) => ErrorResponse,
): Promise<Response | ErrorResponse>;
```

A generic utility function to execute asynchronous endpoint logic with error handling.

- `handler` — The async function containing the main logic.
- `errorHandler` — The function to handle any errors thrown by the handler.

> Returns either the successful response or the error response.

### executeEndpointWithSchema

```ts
export const executeEndpointWithSchema = async <
  Schema extends z.ZodType,
  Response,
  ErrorResponse
>(
  context: Context,
  schema: Schema,
  handler: (value: z.infer<Schema>) => Promise<Response>,
  errorHandler: (e: unknown) => ErrorResponse,
): Promise<Response | ErrorResponse>;
```

A helper to parse and validate the JSON body of a request against a Zod schema, then execute the handler with the parsed input.

- `context` — The Hono context object.
- `schema` — A Zod schema to validate and parse the JSON input.
- `handler` — Async function receiving the parsed input.
- `errorHandler` — Error handling function.

> Returns either the successful response or the error response.

### ResponseFactory

```ts
export type ResponseHelperConfig = {
  defaultOkStatus?: ContentfulStatusCode;
  defaultErrorStatus?: ContentfulStatusCode;
  wrapErrorMessage?: boolean;
  url?: string;
};

export function ResponseFactory(config?: Partial<ResponseHelperConfig>);
```

Creates a helper object to standardize JSON responses and redirects in endpoints.

Options:
- `defaultOkStatus` — HTTP status code for successful responses (default: 200).
- `defaultErrorStatus` — HTTP status code for error responses (default: 500).
- `wrapErrorMessage` — Wrap error strings in { message: string } object (default: true).
- `url` — Default redirect URL (default: './').

Return methods:
- `jsonOk(c: Context, data: JsonCompatible, status?: ContentfulStatusCode)` — Respond with JSON success.
- `jsonError(c: Context, message: string | {}, status?: ContentfulStatusCode)` — Respond with JSON error.
- `defaultRedirect(c: Context)` — Redirect to default URL.
- `redirectTo(c: Context, url: string, status?: RedirectStatusCode)` — Redirect to specific URL with status code.


### parseJsonInputSchema
```ts
export const parseJsonInputSchema = async <T extends z.ZodType>(
  c: Context,
  schema: T
): Promise<z.infer<T>>;
```
Parses the JSON body of a request and validates it against a Zod schema.

> Throws if validation fails.

### parseParams

```ts
export const parseParams = <T extends z.ZodType>(c: Context, schema: T);
```
Parses and validates path parameters from the request using a Zod schema.

### parseQuery

```ts
export const parseQuery = <T extends z.ZodType>(c: Context, schema: T);
```
Parses and validates query parameters from the request using a Zod schema.