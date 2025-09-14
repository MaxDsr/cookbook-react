import {Model, Types} from "mongoose";
import {Entity} from "@/contracts/entity";
import {IUser} from "@/contracts/user";

export interface IRecipe extends Entity {
  name: string
  image: { filename: string, etag: string }
  ingredients: Array<string>
  time: string,
  servings: number
  steps: string,
  userId: IUser['_id']
}

export type RecipeModel = Model<IRecipe>;
