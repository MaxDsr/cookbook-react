import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Plus } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import RecipeDialog from '../components/RecipeDialog';
import { 
  useGetRecipesQuery, 
  useCreateRecipeMutation, 
  useEditRecipeMutation, 
  useDeleteRecipeMutation 
} from '../store/api/recipesApi';
import { useApiState, useMutationState } from '../hooks/useApiState';
import './CookbookPage.css';

const CookbookPage = forwardRef((props, ref) => {
  // RTK Query hooks
  const recipesQuery = useGetRecipesQuery();
  const [createRecipe] = useCreateRecipeMutation();
  const [editRecipe] = useEditRecipeMutation();
  const [deleteRecipe] = useDeleteRecipeMutation();

  // API state management
  const recipesState = useApiState(recipesQuery);

  // Local state for UI
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [dialogMode, setDialogMode] = useState('view'); // 'view', 'edit', 'create'
  const [isDialogOpen, setIsDialogOpen] = useState(false);

	const recipes = recipesState.data;

  const handleCardClick = (recipe) => {
    setSelectedRecipe(recipe);
    setDialogMode('view');
    setIsDialogOpen(true);
  };

  const handleEditRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setDialogMode('edit');
    setIsDialogOpen(true);
  };

  const handleDeleteRecipe = (recipe) => {
    // Show confirmation dialog through the RecipeDialog component
    setSelectedRecipe(recipe);
    setDialogMode('view');
    setIsDialogOpen(true);
  };

  const handleCreateNewRecipe = () => {
    setSelectedRecipe(null);
    setDialogMode('create');
    setIsDialogOpen(true);
  };

  useImperativeHandle(ref, () => ({
    handleCreateNewRecipe
  }));

  const handleSaveRecipe = async (recipeData) => {
    try {
      if (dialogMode === 'create') {
        // Create new recipe via API
        await createRecipe(recipeData).unwrap();
      } else {
        // Update existing recipe via API
        await editRecipe({ 
          recipeId: recipeData.id, 
          ...recipeData 
        }).unwrap();
      }
      // Close dialog on success
      closeDialog();
    } catch (error) {
      // Error handling - you can add toast notifications here
      console.error('Failed to save recipe:', error);
    }
  };

  const handleDeleteConfirm = async (recipe) => {
    try {
      // Delete recipe via API
      await deleteRecipe(recipe.id).unwrap();
      // Close dialog on success
      closeDialog();
    } catch (error) {
      // Error handling - you can add toast notifications here
      console.error('Failed to delete recipe:', error);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedRecipe(null);
    setDialogMode('view');
  };

  // Show loading state
  if (recipesState.isLoading) {
    return (
      <div className="cookbook-page">
        <div className="cookbook-content">
          <div className="empty-state">
            <div className="loading-spinner"></div>
            <p>Loading recipes...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (recipesState.isError) {
    return (
      <div className="cookbook-page">
        <div className="cookbook-content">
          <div className="empty-state">
            <h2>Error loading recipes</h2>
            <p>{recipesState.error}</p>
            <button 
              className="create-recipe-btn primary"
              onClick={() => recipesQuery.refetch()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cookbook-page">
      <div className="cookbook-content">
        <main className="recipes-grid">
          {recipesState.isSuccess && recipes?.length && recipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onCardClick={handleCardClick}
              onEdit={handleEditRecipe}
              onDelete={handleDeleteRecipe}
            />
          ))}
        </main>

        {recipesState.isSuccess && recipes?.length === 0 && (
          <div className="empty-state">
            <h2>No recipes yet</h2>
            <p>Create your first recipe to get started!</p>
            <button 
              className="create-recipe-btn primary"
              onClick={handleCreateNewRecipe}
            >
              <Plus size={20} />
              Create New Recipe
            </button>
          </div>
        )}
      </div>

      <RecipeDialog
        recipe={selectedRecipe}
        isOpen={isDialogOpen}
        onClose={closeDialog}
        onSave={handleSaveRecipe}
        onDelete={handleDeleteConfirm}
        mode={dialogMode}
      />
    </div>
  );
});

CookbookPage.displayName = 'CookbookPage';

export default CookbookPage;
