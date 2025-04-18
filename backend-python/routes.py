from flask import Blueprint, request, jsonify
from app import db
from models import Recipe
from auth0_config import requires_auth
import uuid

recipe_bp = Blueprint('recipes', __name__)

@recipe_bp.route('/', methods=['GET'])
@requires_auth
def get_recipes():
    recipes = Recipe.query.all()
    return jsonify([recipe.to_dict() for recipe in recipes])

@recipe_bp.route('/<string:recipe_id>', methods=['GET'])
@requires_auth
def get_recipe(recipe_id):
    try:
        # Validate UUID format
        uuid.UUID(recipe_id)
        recipe = Recipe.query.get_or_404(recipe_id)
        return jsonify(recipe.to_dict())
    except ValueError:
        return jsonify({'error': 'Invalid UUID format'}), 400

@recipe_bp.route('/', methods=['POST'])
@requires_auth
def create_recipe():
    data = request.get_json()
    
    # Validate ingredients is a list
    if not isinstance(data.get('ingredients'), list):
        return jsonify({'error': 'Ingredients must be an array'}), 400
    
    recipe = Recipe(
        title=data['title'],
        description=data['description'],
        ingredients=data['ingredients'],
        instructions=data['instructions'],
        prep_time=data.get('prep_time'),
        cook_time=data.get('cook_time'),
        servings=data.get('servings')
    )
    
    db.session.add(recipe)
    db.session.commit()
    
    return jsonify(recipe.to_dict()), 201

@recipe_bp.route('/<string:recipe_id>', methods=['PUT'])
@requires_auth
def update_recipe(recipe_id):
    try:
        # Validate UUID format
        uuid.UUID(recipe_id)
        recipe = Recipe.query.get_or_404(recipe_id)
        data = request.get_json()
        
        # Validate ingredients is a list if provided
        if 'ingredients' in data and not isinstance(data['ingredients'], list):
            return jsonify({'error': 'Ingredients must be an array'}), 400
        
        recipe.title = data.get('title', recipe.title)
        recipe.description = data.get('description', recipe.description)
        recipe.ingredients = data.get('ingredients', recipe.ingredients)
        recipe.instructions = data.get('instructions', recipe.instructions)
        recipe.prep_time = data.get('prep_time', recipe.prep_time)
        recipe.cook_time = data.get('cook_time', recipe.cook_time)
        recipe.servings = data.get('servings', recipe.servings)
        
        db.session.commit()
        return jsonify(recipe.to_dict())
    except ValueError:
        return jsonify({'error': 'Invalid UUID format'}), 400

@recipe_bp.route('/<string:recipe_id>', methods=['DELETE'])
@requires_auth
def delete_recipe(recipe_id):
    try:
        # Validate UUID format
        uuid.UUID(recipe_id)
        recipe = Recipe.query.get_or_404(recipe_id)
        db.session.delete(recipe)
        db.session.commit()
        return '', 204
    except ValueError:
        return jsonify({'error': 'Invalid UUID format'}), 400 