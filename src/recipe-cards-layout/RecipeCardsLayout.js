import {useEffect, useState} from "react";
import {RecipeCard} from "../recipe-card/RecipeCard";
import CircularProgress from "@mui/material/CircularProgress";
import './RecipeCardsLayout.scss';
import {CreateRecipeDialog2} from "../create-recipe-dialog/CreateRecipeDialog";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import { setRecipes } from "../services/store/RecipesSlice";

export function RecipeCardsLayout() {
  const [recipesLoading, setRecipesLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const recipes = useSelector((state) => state.recipes.value);

  useEffect(() => {
    dispatch(setRecipes(() => setRecipesLoading(false)));
  }, []);

  const getRecipesView = (recipes) =>
    recipes.map((recipeCardData) =>
      <RecipeCard key={'RecipeCard' + recipeCardData.id} cardData={recipeCardData}/>);

  return (
    <div className="RecipeCardsLayout">
      <div className="button-wrap">
        <Button variant="contained"
                disabled={recipesLoading}
                onClick={() => setDialogOpen(true)}>
          Create new recipe
        </Button>
      </div>
      <div className={`cards ${recipes && !recipesLoading ? 'loaded' : 'isLoading'}`}>
        {recipes && !recipesLoading ? getRecipesView(recipes) : <CircularProgress/>}
      </div>
      <CreateRecipeDialog2 open={dialogOpen} onClose={() => setDialogOpen(false)}/>
    </div>
  );
}
