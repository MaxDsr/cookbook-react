import { v4 as uuidv4 } from 'uuid';
import { recipes } from "./recipes";

function getRecipesAPI() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(recipes.data);
    }, 1000);
  });
}


function deleteRecipeAPI(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const elementToDelete = recipes.data.find(recipe => recipe.id === id);
      if (elementToDelete) {
        resolve(true);
      } else {
        reject('Id not found');
      }
    }, 1500);
  });
}


function createRecipeAPI(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const newRecipe = { ...data, id: recipes.nextId };
      recipes.data = [...recipes.data, newRecipe];
      recipes.nextId = uuidv4();
      resolve(recipes.nextId);
    }, 1500);
  });
}


export const ApiService = {
  getRecipesAPI: getRecipesAPI,
  deleteRecipeAPI: deleteRecipeAPI,
  createRecipeAPI: createRecipeAPI,
};
