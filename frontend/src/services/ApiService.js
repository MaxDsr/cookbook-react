import { v4 as uuidv4 } from 'uuid';
import { recipes } from "./recipes";

function getRecipesAPI() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...recipes.data]);
    }, 1000);
  });
}


function deleteRecipeAPI(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const willRejectNumber = Math.floor(Math.random() * 5) + 1; // rand number between 1 and 5
      const elementToDelete = recipes.data.find(recipe => recipe._id === id);
      if (willRejectNumber === 3) {
        return reject('Assume that API call has failed and this is the error');
      }
      if (elementToDelete) {
        const indexOfElementToRemove = recipes.data.indexOf(elementToDelete);
        recipes.data.splice(indexOfElementToRemove, 1);
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
      resolve();
    }, 1500);
  });
}

function editRecipeAPI(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const editedRecipe = JSON.parse(JSON.stringify(data));
      const recipeToReplace = recipes.data.find(recipe => recipe._id === editedRecipe._id);
      if (!recipeToReplace) {
        reject('Something went wrong. Please try again');
        return;
      }
      const index = recipes.data.indexOf(recipeToReplace);
      recipes.data[index] = editedRecipe;
      resolve(true);
    }, 1500);
  })
}


export const ApiService = {
  getRecipesAPI: getRecipesAPI,
  deleteRecipeAPI: deleteRecipeAPI,
  createRecipeAPI,
  editRecipeAPI: editRecipeAPI,
};
