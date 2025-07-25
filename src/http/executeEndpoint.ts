

export const executeEndpoint = async <Response, ErrorResponse>(
  handler: () => Promise<Response>,
  errorHandler: (e: unknown) => ErrorResponse,
): Promise<Response | ErrorResponse> => {
  try {
    return await handler();
  } catch (e) {
    return errorHandler(e);
  }
};
