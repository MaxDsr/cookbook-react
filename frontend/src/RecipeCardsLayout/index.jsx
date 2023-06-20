import { useCallback, useEffect, useState } from "react";
import RecipeCard from "../RecipeCard";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { setRecipes } from "../services/store/RecipesSlice";
import DeleteRecipeDialog from "./DeleteRecipeDialog"
import StyledDiv from "./styles";
import CreateRecipeDialog from "../CreateRecipeDialog";
import ViewRecipeDialog from "../ViewRecipeDialog";
import {getRecipeById} from "./helpers";

export function RecipeCardsLayout() {
  const [recipesLoading, setRecipesLoading] = useState(true);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteRecipeId, setDeleteRecipeId] = useState(null);
  const [recipeData, setRecipeData] = useState(null);
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
    !viewDialogOpen && setRecipeData(null);
  };

  const closeViewDialog = (clearData) => {
    setViewDialogOpen(false);
    if (clearData) {
      setRecipeData(null);
    }
  }

  //TODO should be refactored..
  const editRecipe = (recipeId) => {
    const recipe = getRecipeById(recipes, recipeId);
    recipe && setRecipeData(recipe);
    setCreateDialogOpen(true);
  };

  //TODO should be refactored..
  const viewRecipe = (recipeCardDataId) => {
    const recipe = getRecipeById(recipes, recipeCardDataId);
    recipe && setRecipeData(recipe);
    setViewDialogOpen(true);
  };

  const getRecipesView = (recipes) =>
    recipes.map((recipeCardData) =>
      <RecipeCard
        key={'RecipeCard' + recipeCardData.id}
        cardData={recipeCardData}
        onViewClick={() => viewRecipe(recipeCardData.id)}
        onEditClick={() => editRecipe(recipeCardData.id)}
        onDeleteRecipe={() => deleteRecipe(recipeCardData.id)}/>
    );

  return (
    <StyledDiv>
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
      <ViewRecipeDialog
        open={viewDialogOpen}
        recipeId={recipeData?.id}
        onEdit={() => editRecipe(recipeData?.id)}
        onDelete={() => deleteRecipe(recipeData?.id)}
        onClose={closeViewDialog}/>
      <CreateRecipeDialog
        open={createDialogOpen}
        recipeData={recipeData}
        onClose={closeCreateEditDialog}/>
      <DeleteRecipeDialog
        open={deleteDialogOpen}
        onClose={deleteRecipeClose}
        itemId={deleteRecipeId}/>
    </StyledDiv>
  );
}
