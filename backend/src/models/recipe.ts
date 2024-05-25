import {Schema, model, Types} from 'mongoose'
import {IRecipe, IRecipeMethods, RecipeModel} from "@/contracts/recipe";
import ObjectId = Types.ObjectId;


const schema = new Schema<IRecipe, RecipeModel, IRecipeMethods>(
  {
    name: String,
    imageUrl: String,
    ingredients: [{type: String}],
    time: String,
    servings: Number,
    steps: String,
    userId: ObjectId
  }
);

export const Recipe = model<IRecipe, RecipeModel>('recipes', schema);
