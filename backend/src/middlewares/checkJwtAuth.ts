import {auth} from "express-oauth2-jwt-bearer";
import {auth0Config} from "@/constants/auth0Config";
import {StatusCodes} from "http-status-codes";


/*
some expired tokens for max101ww+secondtest@gmail.com:

eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InhKcUhvYWhJbUpqRmZLMWR6bVlJWSJ9.eyJpc3MiOiJodHRwczovL2Rldi00Mm92cHEybWphMmgwbnFxLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw2NWQ1YzY4MjAxNzc0MTBiMDlhMGI0MjgiLCJhdWQiOlsiaHR0cHM6Ly9kZXYtNDJvdnBxMm1qYTJoMG5xcS51cy5hdXRoMC5jb20vYXBpL3YyLyIsImh0dHBzOi8vZGV2LTQyb3ZwcTJtamEyaDBucXEudXMuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTcwODUwODgxNiwiZXhwIjoxNzA4NTk1MjE2LCJhenAiOiJvc2ZlajkxdmJZVmh5aUphSThiTHFZU2R3bkJiQVd2USIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwifQ.ZxBKXsLC5IH2N3rpuXNwQ2pAWufAsTzCNOIqd4SDLUbMoX3ZEjMvdd88VCOabgsGrDxoO62O3t9t0K91pco4WlwlvyeHSZ62mf8dM_ApuU5FWEaKaNMKNPGWTl092C8lq8n5RnG5ls5oAAHW2q1yngbLc-KcV8t5PBRweAwDSoTwdDfqXq2vttdEPzst3qRRa9t6rmCcaz2fxCq8SKQCOAVPCJfMVTs4HJTejh-ez0ELa7Ea0KrY1aYYaDeHVBjGN04vhIjVol6YmokDV8M1EishDCm8oIB7tPzncAOcfXYrWkQ4hfi8GEJQzBtFgpyW3Juse6b25N5ENMAEF-qMIg
 */

const handleJwtAuthError = (err: any, req: any, res: any, next: any) => {
  if (err.status && err.status === StatusCodes.UNAUTHORIZED) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Unauthorized",
      status: StatusCodes.UNAUTHORIZED
    });
  }

  next && next();
}

export const checkJwtAuth = [
  auth({
    audience: auth0Config.audience,
    issuerBaseURL: `https://${auth0Config.domain}/`,
  }),
  handleJwtAuthError
];

