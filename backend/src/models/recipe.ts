import { Schema, model } from 'mongoose'
import {IRecipe, IRecipeMethods, RecipeModel} from "@/contracts/recipe";


const schema = new Schema<IRecipe, RecipeModel, IRecipeMethods>(
  {
    name: String,
    imageUrl: String,
    ingredients: [{type: String}],
    time: String,
    servings: Number,
    steps: String
  }
);

export const Recipe = model<IRecipe, RecipeModel>('recipes', schema);
