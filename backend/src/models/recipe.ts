import {Schema, model, Types} from 'mongoose'
import {IRecipe, RecipeModel} from "@/contracts/recipe";
import ObjectId = Types.ObjectId;


const schema = new Schema<IRecipe, RecipeModel>(
  {
    name: String,
    imageUrl: String,
    ingredients: [{type: String}],
    time: String,
    servings: Number,
    steps: String,
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // One to many relationship
  }
);

export const Recipe = model<IRecipe, RecipeModel>('recipes', schema);
