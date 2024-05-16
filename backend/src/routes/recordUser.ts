import {Router} from "express";
import {checkJwtAuth} from "@/middlewares/checkJwtAuth";
import {recordUserController} from "@/controllers/recordUserController";


export const recordUser = (router: Router): void => {
  router.post(
    '/recordUser',
    checkJwtAuth,
    recordUserController.recordUser
  )
}
