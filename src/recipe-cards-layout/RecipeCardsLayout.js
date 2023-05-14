import { useCallback, useEffect, useState } from "react";
import { RecipeCard } from "../recipe-card/RecipeCard";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { setRecipes } from "../services/store/RecipesSlice";
import { DeleteRecipeDialog } from "../recipe-card/DeleteRecipeDialog";
import { RecipeCardsLayoutWrap } from "./RecipeCardsLayoutStyles";
import CreateRecipeDialog from "../CreateRecipeDialog";
import ViewRecipe from "../ViewRecipe";

export function RecipeCardsLayout() {
  const [recipesLoading, setRecipesLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteRecipeId, setDeleteRecipeId] = useState(null);
  const [editRecipeData, setEditRecipeData] = useState(null);
  const dispatch = useDispatch();
  const recipes = useSelector((state) => state.recipes.value);

  useEffect(() => {
    dispatch(setRecipes(() => setRecipesLoading(false)));
  }, []);

  const deleteRecipe = (recipeId) => {
    setDeleteRecipeId(recipeId);
    setDeleteDialogOpen(true);
  };

  const deleteRecipeClose = useCallback(() => {
    setDeleteRecipeId(null);
    setDeleteDialogOpen(false);
  }, []);

  const closeCreateEditDialog = () => {
    setCreateDialogOpen(false);
    setEditRecipeData(null);
  };


  const onEditClick = useCallback((recipeId) => {
    let recipe = recipes.find(item => item.id === recipeId);
    recipe = recipe && JSON.parse(JSON.stringify(recipe));
    recipe && setEditRecipeData(recipe);
    setCreateDialogOpen(true);
  }, [recipes]);

  const getRecipesView = (recipes) =>
    recipes.map((recipeCardData) =>
      <RecipeCard key={'RecipeCard' + recipeCardData.id} cardData={recipeCardData} onEditClick={onEditClick} onDeleteRecipe={() => deleteRecipe(recipeCardData.id)}/>);

  return (
    <RecipeCardsLayoutWrap>
      <div className="button-wrap">
        <Button variant="contained"
                disabled={recipesLoading}
                onClick={() => setCreateDialogOpen(true)}>
          Create new recipe
        </Button>
      </div>
      <div className={`cards ${recipes && !recipesLoading ? 'loaded' : 'isLoading'}`}>
        {recipes && !recipesLoading ? getRecipesView(recipes) : <CircularProgress/>}
      </div>
      <CreateRecipeDialog open={createDialogOpen} recipeData={editRecipeData} onClose={closeCreateEditDialog}/>
      <DeleteRecipeDialog open={deleteDialogOpen} onClose={deleteRecipeClose} itemId={deleteRecipeId}/>
      <ViewRecipe/>
    </RecipeCardsLayoutWrap>
  );
}
