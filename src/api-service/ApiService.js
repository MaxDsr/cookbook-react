import {recipes} from "./recipes";
import { createStore } from 'redux';


function getRecipesApi() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('the timeout of 10s completed');
      resolve(recipes);
    }, 3000);
  });
}

function storeReducer(state = { recipes: null }, action) {
  console.log('state inside reducer: ', state);
  console.log('action inside reducer: ', action);

  switch (action.type) {
    case 'recipes':
      return { recipes: action.updatedRecipes };
    default:
      return state
  };
};

let store = createStore(storeReducer);

export const ApiService = {
  getRecipes: getRecipesApi,
  getStore: store,
  fetchRecipesFromAPI: () => {
    getRecipesApi().then(recipes => store.dispatch({ type: 'recipes', updatedRecipes: recipes }))
  }
};
