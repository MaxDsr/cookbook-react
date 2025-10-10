import React, { useState, useEffect, useRef } from 'react';
import { X, Edit, Trash2, Plus, Minus } from 'lucide-react';
import './RecipeDialog.css';

const RecipeDialog = ({ 
  recipe, 
  isOpen, 
  onClose, 
  onSave, 
  onDelete,
  mode = 'view' // 'view', 'edit', or 'create'
}) => {
  const [activeTab, setActiveTab] = useState(mode === 'create' ? 'edit' : 'view');
  const [editedRecipe, setEditedRecipe] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (recipe) {
      setEditedRecipe({ ...recipe });
      setImagePreview(recipe.imageUrl);
      setImageFile(null); // Reset file when opening existing recipe
    } else if (mode === 'create') {
      // Initialize empty recipe for creation
      setEditedRecipe({
        _id: Date.now(),
        name: '',
        imageUrl: '',
        servings: 1,
        time: '00:30',
        ingredients: [''],
        steps: ''
      });
      setImagePreview(null);
      setImageFile(null); // Reset file when creating new recipe
    }
    setActiveTab(mode === 'create' ? 'edit' : 'view');
  }, [recipe, mode]);

  useEffect(() => {
    if (mode === 'edit') {
      setActiveTab('edit');
    }
  }, [mode]);

  // Prevent background scrolling when dialog is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Prevent scrolling on body
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      return () => {
        // Restore scrolling
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleInputChange = (field, value) => {
    setEditedRecipe(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...editedRecipe.ingredients];
    newIngredients[index] = value;
    setEditedRecipe(prev => ({
      ...prev,
      ingredients: newIngredients
    }));
  };

  const handleIngredientKeyPress = (e, index, focusCallback) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient(index + 1);
      // Focus the new input after a brief delay to ensure it's rendered
      setTimeout(() => {
        if (focusCallback) {
          focusCallback();
        }
      }, 10);
    }
  };

  const addIngredient = (index = editedRecipe.ingredients.length) => {
    const newIngredients = [...editedRecipe.ingredients];
    newIngredients.splice(index, 0, '');
    setEditedRecipe(prev => ({
      ...prev,
      ingredients: newIngredients
    }));
  };

  const removeIngredient = (index) => {
    if (editedRecipe.ingredients.length > 1) {
      const newIngredients = editedRecipe.ingredients.filter((_, i) => i !== index);
      setEditedRecipe(prev => ({
        ...prev,
        ingredients: newIngredients
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Store the actual File object
      setImageFile(file);
      
      // Create preview URL for display
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setImagePreview(imageUrl);
        setEditedRecipe(prev => ({
          ...prev,
          imageUrl: imageUrl
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (editedRecipe.name?.trim() && editedRecipe.ingredients.some(ing => ing.trim())) {
      // Filter out empty ingredients
      const cleanedRecipe = {
        ...editedRecipe,
        ingredients: editedRecipe.ingredients.filter(ing => ing.trim())
      };
			delete cleanedRecipe.imageUrl;
      // Pass both the recipe data and the file object
      onSave(cleanedRecipe, imageFile);
      onClose();
    }
  };

  const handleDelete = () => {
    onDelete(recipe);
    setShowDeleteConfirm(false);
    onClose();
  };

  const displayRecipe = activeTab === 'view' ? recipe : editedRecipe;

  return (
    <div className="recipe-dialog-overlay" onClick={handleOverlayClick}>
      <div className="recipe-dialog">
        <div className="recipe-dialog-header">
          <div className="dialog-tabs">
            {mode !== 'create' && (
              <button 
                className={`tab-button ${activeTab === 'view' ? 'active' : ''}`}
                onClick={() => setActiveTab('view')}
              >
                View
              </button>
            )}
            <button 
              className={`tab-button ${activeTab === 'edit' ? 'active' : ''}`}
              onClick={() => setActiveTab('edit')}
            >
              {mode === 'create' ? 'Create Recipe' : 'Edit'}
            </button>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div 
          className="recipe-dialog-content"
          onWheel={(e) => e.stopPropagation()}
        >
          {activeTab === 'view' && displayRecipe ? (
            <ViewTab recipe={displayRecipe} />
          ) : (
            !!editedRecipe && <EditTab 
              recipe={editedRecipe}
              imagePreview={imagePreview}
              onInputChange={handleInputChange}
              onIngredientChange={handleIngredientChange}
              onIngredientKeyPress={handleIngredientKeyPress}
              onAddIngredient={addIngredient}
              onRemoveIngredient={removeIngredient}
              onImageUpload={handleImageUpload}
            />
          )}
        </div>

        <div className="recipe-dialog-actions">
          {activeTab === 'view' && mode !== 'create' && (
            <>
              <button 
                className="action-btn edit-btn"
                onClick={() => setActiveTab('edit')}
              >
                <Edit size={16} />
                Edit
              </button>
              <button 
                className="action-btn delete-btn"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 size={16} />
                Delete
              </button>
            </>
          )}
          
          {activeTab === 'edit' && (
            <>
              <button 
                className="action-btn cancel-btn"
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                className="action-btn save-btn"
                onClick={handleSave}
              >
                {mode === 'create' ? 'Create Recipe' : 'Save Changes'}
              </button>
            </>
          )}
        </div>

        {showDeleteConfirm && (
          <ConfirmDialog
            message="Are you sure you want to delete this recipe?"
            onConfirm={handleDelete}
            onCancel={() => setShowDeleteConfirm(false)}
          />
        )}
      </div>
    </div>
  );
};

const ViewTab = ({ recipe }) => {
  if (!recipe) {
    return <div className="view-tab">Loading...</div>;
  }

  return (
    <div className="view-tab">
      <div className="recipe-image">
        <img 
          src={recipe.imageUrl} 
          alt={recipe.name}
          onError={(e) => {
            e.target.src = '/placeholder-image.svg';
          }}
        />
      </div>
      <h2 className="recipe-title">{recipe.name}</h2>
      
      <div className="recipe-meta">
        <div className="meta-item">
          <span className="meta-label">Nr. of servings:</span>
          <span className="meta-value">{recipe.servings}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Cooking time:</span>
          <span className="meta-value">{recipe.time}</span>
        </div>
      </div>

      <div className="ingredients-section">
        <h3>Ingredients</h3>
        <ul className="ingredients-list">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>

      <div className="preparation-section">
        <h3>Preparation steps</h3>
        <div className="preparation-steps">
          {recipe.steps.split('\n').map((step, index) => (
            <p key={index}>{step}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

const EditTab = ({ 
  recipe, 
  imagePreview, 
  onInputChange, 
  onIngredientChange, 
  onIngredientKeyPress,
  onAddIngredient, 
  onRemoveIngredient, 
  onImageUpload 
}) => {
  const ingredientRefs = useRef([]);
	
  // Update refs array when ingredients change
  useEffect(() => {
    ingredientRefs.current = ingredientRefs.current.slice(0, recipe.ingredients.length);
  }, [recipe.ingredients.length]);

  const focusIngredient = (index) => {
    if (ingredientRefs.current[index]) {
      ingredientRefs.current[index].focus();
    }
  };

  return (
  <div className="edit-tab">
    <div className="form-group">
      <label>Recipe Image</label>
      <input 
        type="file" 
        accept="image/*" 
        onChange={onImageUpload}
        className="file-input"
      />
      {imagePreview && (
        <div className="image-preview">
          <img 
            src={imagePreview} 
            alt="Recipe preview"
            onError={(e) => {
              e.target.src = '/placeholder-image.svg';
            }}
          />
        </div>
      )}
    </div>

    <div className="form-group">
      <label>Recipe Title</label>
      <input 
        type="text" 
        value={recipe.name}
        onChange={(e) => onInputChange('name', e.target.value)}
        placeholder="Enter recipe title"
      />
    </div>

    <div className="form-row">
      <div className="form-group">
        <label>Nr. of servings</label>
        <input 
          type="number" 
          min="1"
          value={recipe.servings}
          onChange={(e) => onInputChange('servings', parseInt(e.target.value) || 1)}
        />
      </div>
      <div className="form-group">
        <label>Cooking time (HH:MM)</label>
        <input 
          type="time" 
          value={recipe.time}
          onChange={(e) => onInputChange('time', e.target.value)}
        />
      </div>
    </div>

    <div className="form-group">
      <label>Ingredients</label>
      <div className="ingredients-editor">
        {recipe.ingredients.map((ingredient, index) => (
          <div key={index} className="ingredient-row">
            <input 
              ref={(el) => ingredientRefs.current[index] = el}
              type="text" 
              value={ingredient}
              onChange={(e) => onIngredientChange(index, e.target.value)}
              onKeyPress={(e) => onIngredientKeyPress(e, index, () => focusIngredient(index + 1))}
              placeholder="Enter ingredient"
            />
            <button 
              type="button"
              className="remove-ingredient"
              onClick={() => onRemoveIngredient(index)}
              disabled={recipe.ingredients.length === 1}
            >
              <Minus size={16} />
            </button>
          </div>
        ))}
        <button 
          type="button"
          className="add-ingredient"
          onClick={() => onAddIngredient()}
        >
          <Plus size={16} />
          Add Ingredient
        </button>
      </div>
    </div>

    <div className="form-group">
      <label>Preparation steps</label>
      <textarea 
        value={recipe.steps}
        onChange={(e) => onInputChange('steps', e.target.value)}
        placeholder="Enter preparation steps..."
        rows="8"
      />
    </div>
  </div>
  );
};

const ConfirmDialog = ({ message, onConfirm, onCancel }) => (
  <div className="confirm-dialog-overlay">
    <div className="confirm-dialog">
      <p>{message}</p>
      <div className="confirm-actions">
        <button className="cancel-btn" onClick={onCancel}>Cancel</button>
        <button className="confirm-btn" onClick={onConfirm}>Delete</button>
      </div>
    </div>
  </div>
);

export default RecipeDialog;
