import {Response} from "express";
import {ReasonPhrases, StatusCodes} from "http-status-codes";
import winston from "winston";
import {Recipe} from "@/models";

export const testController = {
  test: async (
    test: any,
    res: Response
  ) => {
    try {
      const recipe = new Recipe({
        name: "Super soup",
        imageUrl: "superhttps://",
        ingredients: ["hello", "mellow", "yellow"],
        time: "the time",
        servings: 10,
        steps: "Make this. Do that"
      });
      recipe.save();
      return res.status(StatusCodes.OK).json({
        data: { tester: "alll" },
        message: ReasonPhrases.OK,
        status: StatusCodes.OK
      });
    } catch (error) {
      winston.error(error)

      return res.status(StatusCodes.BAD_REQUEST).json({
        message: ReasonPhrases.BAD_REQUEST,
        status: StatusCodes.BAD_REQUEST
      })
    }
  },
}
