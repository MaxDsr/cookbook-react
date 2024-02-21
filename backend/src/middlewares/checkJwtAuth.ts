import {auth, FunctionValidator} from "express-oauth2-jwt-bearer";
import {auth0Config} from "@/constants/auth0Config";


const handleJwtAuthError = (err: any, req: any, res: any, next: any) => {

  console.log("error");
  console.log(err);

  console.log("status");
  console.log(err.status);

  // Check if the error is an UnauthorizedError
  if (err.name === 'UnauthorizedError') {
    // Respond with a custom JSON message
    return res.status(401).json({
      success: false,
      message: 'You are not authorized to access this resource. Please provide a valid token.',
    });
  }

  // Optional: handle other types of errors or pass them to the default Express error handler
  if (next) {
    next(err);
  } else {
    // Generic error response
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred.',
    });
  }
}

export const checkJwtAuth = [
  auth({
    audience: auth0Config.audience,
    issuerBaseURL: `https://${auth0Config.domain}/`,
  }),
  handleJwtAuthError
];

