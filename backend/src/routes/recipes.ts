import {Router} from "express";
import {recipeController} from "@/controllers";

export const recipes = (router: Router): void => {
  router.get(
    '/recipes',
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
