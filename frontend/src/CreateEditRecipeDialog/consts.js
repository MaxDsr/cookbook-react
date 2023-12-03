
export const INPUT_VALIDATION_RULES = {
  required: {
    value: true,
    message: 'This field is required'
  },
  maxLength: { value: 80, message: 'Text is too long!' }
};

export const STEPS_VALIDATION_RULES = {
  ...INPUT_VALIDATION_RULES,
  maxLength: { value: 900000, message: 'Text is too long!' }
};

export const INGREDIENTS = 'ingredients';
export const INGREDIENT_NAME = 'ingredientName';
export const DEFAULT_IMAGE = `https://st3.depositphotos.com/13324256/17303/i/1600/depositphotos_173034766-stock-photo-woman-writing-down-recipe.jpg`;
