import 'dotenv/config';
import "./seedRecipes";
import {recipes} from "@/seeds/seedRecipes";
import {mongoose} from "@/dataSources";

async function executeSeeder() {
  try {
    await mongoose.run();

    await Promise.all(recipes.map((item: any) => item.save()));
    mongoose.stop();
  } catch (err) {

  }
}

executeSeeder();

