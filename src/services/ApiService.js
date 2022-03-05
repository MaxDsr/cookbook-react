import { v4 as uuidv4 } from 'uuid';
import {recipes} from "./recipes";

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
        resolve(elementToDelete);
      } else {
        reject('Id not found');
      }
    }, 1500);
  });
}


function createRecipeAPI(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      recipes.data.push({...data, id: recipes.nextId});
      recipes.nextId = uuidv4();
      resolve(true);
    }, 1500);
  });
}


export const ApiService = {
  getRecipesAPI: getRecipesAPI,
  deleteRecipeAPI: deleteRecipeAPI,
  createRecipeAPI: createRecipeAPI,
};
