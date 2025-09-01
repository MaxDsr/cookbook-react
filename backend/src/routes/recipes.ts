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
    recipeController.create
  ),
  router.put(
    '/recipes/edit/:id',
    recipeController.edit
  ),
  router.delete(
    '/recipes/delete/:id',
    recipeController.delete
  ),
  router.post(
    '/recipes/upload-image',
    recipeController.uploadImage
  )
}
