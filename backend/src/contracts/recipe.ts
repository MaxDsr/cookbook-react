import {Model} from "mongoose";
import {Entity} from "@/contracts/entity";

export interface IRecipe extends Entity {
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
