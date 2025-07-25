import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";

export type OpenAPIFactoryParams = {
  title?: string;
  description?: string;
  contactName?: string;
  contactEmail?: string;
  licenseName?: string;
  version?: string;
  port?: number;
  servers?: { url: string; description?: string }[];
}

const DEFAULTS = {
  title: 'API Documentation',
  description: 'Automatically generated OpenAPI documentation',
  contactName: 'Support Team',
  contactEmail: 'support@example.com',
  licenseName: 'MIT',
  version: '1.0.0',
  port: 3000,
} as const;

const DEFAULT_SERVERS = [
  { url: 'http://localhost:3000', description: 'Local Server' },
];


export function OpenAPIFactory(params: OpenAPIFactoryParams = {}, logging: boolean = false): OpenAPIHono {
    const {
        title,
        description,
        contactName,
        contactEmail,
        licenseName,
        version,
        port,
        servers = DEFAULT_SERVERS,
    } = { ...DEFAULTS, ...params };

  const app = new OpenAPIHono();

  app.doc('/doc', {
    info: {
      title,
      description,
      contact: {
        name: contactName,
        email: contactEmail,
      },
      license: {
        name: licenseName,
      },
      version,
    },
    servers: servers,
    openapi: '3.1.0',
  });

  
  app.get('/ui', swaggerUI({ url: '/doc' }));

    if(logging) {
        servers.forEach(s => {
            console.log(`Server is running at: ${s.url}`);
            console.log(`OpenAPI UI available at: ${s.url}/ui`);
        })
    }

  return app;
}
