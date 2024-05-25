import {NextFunction, Request} from "express";


export const getUserId = (req: Request, res: any, next: NextFunction) => {
  const userId = req.headers?.['user-id'] as string | undefined;
  req.userId = userId ?? "";

  next();
}
