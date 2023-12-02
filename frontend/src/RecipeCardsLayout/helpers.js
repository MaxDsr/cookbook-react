

export function getRecipeById(recipes, recipeId) {
  let recipe = recipes.find(item => item._id === recipeId);
  recipe = recipe && JSON.parse(JSON.stringify(recipe));
  return recipe;
}
