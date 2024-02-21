import {Router} from "express";
import {recipeController} from "@/controllers";
import {checkJwt} from "@/middlewares/auth0CheckJWT";

export const recipes = (router: Router): void => {
  router.get(
    '/recipes',
    checkJwt,
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
  )
}
