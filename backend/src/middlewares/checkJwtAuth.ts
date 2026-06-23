import {auth} from "express-oauth2-jwt-bearer";
import {auth0Config} from "../constants/auth0Config";
import {StatusCodes} from "http-status-codes";

// Error handler for the auth() middleware. Fails closed: any error reaching here
// means the bearer token was missing, malformed, or failed signature/audience
// verification. We always respond and never call next() — calling next() would hand
// an unauthenticated request to the controller (the old fall-through bug). The library
// returns 400 (invalid_request) for a missing token; normalize all auth failures to
// 401, preserving an explicit 403 for insufficient scope.
// NOTE: the 4th arg is required — Express only treats a middleware as an error
// handler when it declares exactly four parameters. We intentionally never call it.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleJwtAuthError = (err: any, req: any, res: any, next: any) => {
  const code = err?.statusCode || err?.status;
  const status = code === StatusCodes.FORBIDDEN
    ? StatusCodes.FORBIDDEN
    : StatusCodes.UNAUTHORIZED;
  return res.status(status).json({
    message: status === StatusCodes.FORBIDDEN ? "Forbidden" : "Unauthorized",
    status
  });
}

export const checkJwtAuth = [
  auth({
    audience: auth0Config.audience,
    issuerBaseURL: `https://${auth0Config.domain}/`,
  }),
  handleJwtAuthError
];

