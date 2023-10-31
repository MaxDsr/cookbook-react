import {Model, ObjectId} from "mongoose";

export interface IRecipe {
  _id: ObjectId
  name: string
  imageUrl: string
  ingredients: Array<string>
  time: string,
  servings: number
  steps: string
}

export interface IRecipeMethods {
  enoughIngredients: (time: string) => boolean
}

export type RecipeModel = Model<IRecipe, unknown, IRecipeMethods>;
