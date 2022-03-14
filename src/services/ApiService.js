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
      const willRejectNumber = Math.floor(Math.random() * 5) + 1; // rand number between 1 and 5
      const elementToDelete = recipes.data.find(recipe => recipe.id === id);
      if (willRejectNumber === 3) {
        return reject('Assume that API call has failed and this is the error');
      }
      if (elementToDelete) {
        return resolve(true);
      }
      reject('Id of element to be deleted has not been found');
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
