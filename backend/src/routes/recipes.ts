import {Router} from "express";
import {recipeController} from "../controllers";
import {checkJwtAuth} from "../middlewares/checkJwtAuth";
import {uploadSingleImage, handleUploadError} from "../middlewares/uploadMiddleware";

export const recipes = (router: Router): void => {
  router.get(
    '/recipes',
    checkJwtAuth,
    recipeController.getAll
  ),
  router.post(
    '/recipes/create',
    checkJwtAuth,
    uploadSingleImage,
    handleUploadError,
    recipeController.create
  ),
  router.put(
    '/recipes/edit/:id',
    checkJwtAuth,
    uploadSingleImage,
    handleUploadError,
    recipeController.edit
  ),
  router.delete(
    '/recipes/delete/:id',
    recipeController.delete
  ),
  router.post(
    '/recipes/upload-image',
    checkJwtAuth,
    uploadSingleImage,
    handleUploadError,
    recipeController.uploadImage
  )
}
