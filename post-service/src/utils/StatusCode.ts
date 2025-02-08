export enum StatusCode {
    INTERNAL_SERVER_ERROR = 500,
    OK = 200,
    SERVICE_UNAVAILABLE = 503, // Use this for DB connection errors

    NOT_FOUND = 404, 

    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,

  }
  