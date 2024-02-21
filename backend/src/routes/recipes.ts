import {Router} from "express";
import {recipeController} from "@/controllers";
import {checkJwtAuth} from "@/middlewares/checkJwtAuth";

export const recipes = (router: Router): void => {
  router.get(
    '/recipes',
    checkJwtAuth,
    recipeController.getAll
  ),
  router.post(
    '/recipes/create',
    checkJwtAuth,
    recipeController.create
  ),
  router.put(
    '/recipes/edit/:id',
    checkJwtAuth,
    recipeController.edit
  ),
  router.delete(
    '/recipes/delete/:id',
    checkJwtAuth,
    recipeController.delete
  )
}
