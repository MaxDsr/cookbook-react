import {recipes} from "./recipes";

function getRecipesAPI() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const willReject = Math.floor(Math.random() * 5) + 1; // rand number between 1 and 5
      if (willReject !== 3) {
        resolve(recipes);
      } else {
        reject('Error. Please refresh the page');
      }
    }, 1000);
  });
}


function deleteRecipeAPI(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const elementToDelete = recipes.find(recipe => recipe.id === id);
      if (elementToDelete) {
        resolve(elementToDelete);
      } else {
        reject('Id not found');
      }
    }, 1500);
  });
}


export const ApiService = {
  getRecipesAPI: getRecipesAPI,
  deleteRecipeAPI: deleteRecipeAPI
};
