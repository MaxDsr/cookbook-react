import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import './RecipeCard.css';

const RecipeCard = ({ recipe, onCardClick, onEdit, onDelete }) => {
  const handleCardClick = (e) => {
    // Don't trigger card click if user clicked on action buttons
    if (e.target.closest('.recipe-card-actions')) {
      return;
    }
    onCardClick(recipe);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(recipe);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(recipe);
  };

  // Show only first 4 ingredients
  const displayIngredients = recipe.ingredients.slice(0, 4);
  const hasMoreIngredients = recipe.ingredients.length > 4;

  return (
    <div className="recipe-card" onClick={handleCardClick}>
      <div className="recipe-card-image">
        <img 
          src={recipe.imageUrl} 
          alt={recipe.title}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300/e5e7eb/6b7280?text=Recipe+Image';
          }}
        />
        <div className="recipe-card-actions">
          <button 
            className="action-button edit-button" 
            onClick={handleEdit}
            title="Edit recipe"
          >
            <Edit size={16} />
          </button>
          <button 
            className="action-button delete-button" 
            onClick={handleDelete}
            title="Delete recipe"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="recipe-card-content">
        <h3 className="recipe-card-title">{recipe.title}</h3>
        
        <div className="recipe-card-ingredients">
          <ul>
            {displayIngredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
            {hasMoreIngredients && (
              <li className="more-ingredients">and more...</li>
            )}
          </ul>
        </div>
        
        <div className="recipe-card-meta">
          <div className="recipe-card-servings">
            <span className="servings-label">Serves:</span>
            <span className="servings-value">{recipe.servings}</span>
          </div>
          <div className="recipe-card-cooking-time">
            <span className="cooking-time-label">Cooking time:</span>
            <span className="cooking-time-value">{recipe.time}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
