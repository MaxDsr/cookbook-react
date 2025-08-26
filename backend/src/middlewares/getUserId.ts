import {NextFunction, Request} from "express";
import { jwtDecode } from "jwt-decode";

export const getUserId = (req: Request, res: any, next: NextFunction) => {
  const token = req.headers?.['authorization']?.split(" ")[1] ?? "";

  if (!token) {
    next();
    return;
  }

  const decodedToken = jwtDecode(token as string);
  const auth0Id = decodedToken.sub?.split("|")[1];
  req.userId = auth0Id ?? "";

  next();
}
