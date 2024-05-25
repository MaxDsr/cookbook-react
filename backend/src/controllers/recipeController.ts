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
    const body: IRecipe = req.body;
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
    const recipeId: IRecipe['_id'] = req.params.id;
    const body: IRecipe = req.body;
    delete body._id;

    const result = await Recipe.updateOne({_id: recipeId}, {$set: body});

    if (result.matchedCount === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Recipe doesn't exists",
        status: StatusCodes.NOT_FOUND
      });
    }

    if (result.modifiedCount === 0) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "Couldn't update the recipe",
        status: StatusCodes.INTERNAL_SERVER_ERROR
      });
    }

    if (result.modifiedCount === 1 && result.matchedCount === 1) {
      return res.status(StatusCodes.OK).json({
        message: "Ok",
        status: StatusCodes.OK
      });
    }


    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
      status: StatusCodes.INTERNAL_SERVER_ERROR
    });
  },
  delete: async (
    req: Request,
    res: Response
  ) => {
    const recipeId: IRecipe['_id'] = req.params.id;
    const result = await Recipe.deleteOne({_id: recipeId});

    if (result.deletedCount === 1) {
      return res.status(StatusCodes.OK).json({
        message: "ok",
        status: StatusCodes.OK
      });
    }

    if (result.deletedCount === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Recipe doesn't exists",
        status: StatusCodes.NOT_FOUND
      });
    }

    return res.status(StatusCodes.NOT_FOUND).json({
      message: "not found",
      status: StatusCodes.NOT_FOUND
    });
  }
}
