import { messageSchema } from "../schemas";


export const openapiErrors = {
  notFoundError: {
    description: 'License not found',
    content: {
      'application/json': {
        schema: messageSchema,
      },
    },
  },
  defaultError: {
    description: 'Internal Server Error',
    content: {
      'application/json': {
        schema: messageSchema,
      },
    },
  },
};
