import {createStore} from "redux";
import {recipes} from "./recipes";
import {ApiService} from "./ApiService";
import { cloneDeep } from 'lodash';

function fetchRecipes() {
  ApiService.getRecipesAPI().then(
    (recipes) => store.dispatch({ type: 'recipes', updatedRecipes: recipes }),
    (reason) => store.dispatch({ type: 'errorAlert', errorAlert: reason })
  )
}

function setErrorAlert(message) {
  store.dispatch({ type: 'errorAlert', errorAlert: message })
}

function deleteRecipe(id) {
  ApiService.deleteRecipeAPI(id).then(
    (elementToDelete) => {
      recipes.data.splice(recipes.data.indexOf(elementToDelete), 1);
      fetchRecipes();
    },
    (reason) => setErrorAlert(reason)
  )
}

function createRecipe(data) {
  return ApiService.createRecipeAPI(data).then(() => fetchRecipes());
}

function reduceFunction(state = { recipes: { hasChanges: false }, errorAlert: { hasChanges: false } }, action) {

  const getUnmarkedState = (state) => {
    const stateClone = cloneDeep(state);
    Object.keys(stateClone).forEach((key) => stateClone[key].hasChanges = false);
    return stateClone;
  };

  switch (action.type) {
    case 'recipes':
      return { ...getUnmarkedState((state)), recipes: { data: [...action.updatedRecipes], hasChanges: true } };
    case 'errorAlert':
      return { ...getUnmarkedState((state)), errorAlert: { data: action.errorAlert, hasChanges: true } };
    default:
      return state;
  }
}

const store = createStore(reduceFunction);

export const StoreService = {
  storeSubscribe: store.subscribe,
  getStoreState: store.getState,
  fetchRecipes: fetchRecipes,
  setErrorAlert: setErrorAlert,
  deleteRecipe: deleteRecipe,
  createRecipe: createRecipe,
};
