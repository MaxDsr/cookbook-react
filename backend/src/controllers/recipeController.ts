import {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {Recipe} from "@/models";
import {IRecipe} from "@/contracts/recipe";
import {Types} from "mongoose";


export const recipeController = {
  create: async(
    req: Request,
    res: Response
  ) => {

    if (!req.userId) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "User not found",
        status: StatusCodes.NOT_FOUND
      });
    }

    const body: IRecipe = {...req.body, userId: req.userId};
    const recipe = new Recipe({...body});


    try {
      await recipe.save();
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error?.message || error,
        status: StatusCodes.INTERNAL_SERVER_ERROR
      })
    }

    return res.status(StatusCodes.OK).json({
      message: "Ok",
      status: StatusCodes.OK
    });
  },
  getAll: async (
    req: Request,
    res: Response
  ) => {
    try {
      if (!req.userId) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "User not found",
          status: StatusCodes.NOT_FOUND
        });
      }

      const userId = new Types.ObjectId(req.userId);
      const allRecipes = await Recipe.find({userId});
      return res.status(StatusCodes.OK).json({
        data: allRecipes,
        status: StatusCodes.OK
      })
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error,
        status: StatusCodes.INTERNAL_SERVER_ERROR
      });
    }
  },
  edit: async (
    req: Request,
    res: Response,
  ) => {
    if (!req.userId) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "User not found",
        status: StatusCodes.NOT_FOUND
      });
    }

    const recipeId: IRecipe['_id'] = req.params.id;
    const body: IRecipe = req.body;
    delete body._id;

    // const result = await Recipe.updateOne({_id: recipeId}, {$set: body});
    const recipeDoc = await Recipe.findById(recipeId);

    if (!recipeDoc) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Recipe doesn't exists",
          status: StatusCodes.NOT_FOUND
        });
    }

    if (recipeDoc.userId?.toString() !== req.userId) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Can't update recipe",
        status: StatusCodes.FORBIDDEN,
      });
    }

    recipeDoc.name = body.name;
    recipeDoc.imageUrl = body.imageUrl;
    recipeDoc.ingredients = body.ingredients;
    recipeDoc.time = body.time;
    recipeDoc.servings = body.servings;
    recipeDoc.steps = body.steps;

    try {
      await recipeDoc.save();
      return res.status(StatusCodes.OK).json({
        message: "Ok",
        status: StatusCodes.OK
      });
    } catch (error: any) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Couldn't update the recipe",
        status: StatusCodes.INTERNAL_SERVER_ERROR
      })
    }
  },
  delete: async (
    req: Request,
    res: Response
  ) => {
    if (!req.userId) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "User not found",
        status: StatusCodes.NOT_FOUND
      });
    }

    const recipeId: IRecipe['_id'] = req.params.id;
    const recipeDoc = await Recipe.findById(recipeId);

    if (!recipeDoc) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Recipe doesn't exists",
        status: StatusCodes.NOT_FOUND
      });
    }

    if (recipeDoc.userId?.toString() !== req.userId) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Can't delete recipe",
        status: StatusCodes.FORBIDDEN,
      });
    }

    try {
      await recipeDoc.deleteOne();
      return res.status(StatusCodes.OK).json({
        message: "Ok",
        status: StatusCodes.OK
      });
    } catch {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Couldn't delete the recipe",
        status: StatusCodes.INTERNAL_SERVER_ERROR
      })
    }

    return res.status(StatusCodes.NOT_FOUND).json({
      message: "not found",
      status: StatusCodes.NOT_FOUND
    });
  }
}
