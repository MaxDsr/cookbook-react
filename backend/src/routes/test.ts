import {Router} from "express";
import {testController} from "../controllers/testController";


export const test = (router: Router): void => {
  router.get(
    '/test',
    testController.test
  )
}
