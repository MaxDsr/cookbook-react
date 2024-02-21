import {auth} from "express-oauth2-jwt-bearer";
import {auth0Config} from "@/constants/auth0Config";


export const checkJwt = auth({
  audience: auth0Config.audience,
  issuerBaseURL: `https://${auth0Config.domain}/`,
});
