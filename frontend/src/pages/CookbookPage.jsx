import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Plus } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import RecipeDialog from '../components/RecipeDialog';
import { mockRecipes } from '../data/recipes';
import './CookbookPage.css';

const CookbookPage = forwardRef((props, ref) => {
  const [recipes, setRecipes] = useState(mockRecipes);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [dialogMode, setDialogMode] = useState('view'); // 'view', 'edit', 'create'
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const handleSaveRecipe = (recipeData) => {
    if (dialogMode === 'create') {
      // Add new recipe
      setRecipes(prev => [...prev, { ...recipeData, id: Date.now() }]);
    } else {
      // Update existing recipe
      setRecipes(prev => 
        prev.map(recipe => 
          recipe.id === recipeData.id ? recipeData : recipe
        )
      );
    }
  };

  const handleDeleteConfirm = (recipe) => {
    setRecipes(prev => prev.filter(r => r.id !== recipe.id));
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedRecipe(null);
    setDialogMode('view');
  };

  return (
    <div className="cookbook-page">
      <div className="cookbook-content">
        <main className="recipes-grid">
          {recipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onCardClick={handleCardClick}
              onEdit={handleEditRecipe}
              onDelete={handleDeleteRecipe}
            />
          ))}
        </main>

        {recipes.length === 0 && (
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
