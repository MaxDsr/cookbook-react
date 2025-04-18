from app import db
from models import Recipe
from datetime import datetime
import uuid

def seed_database():
    # Sample recipes
    recipes = [
        Recipe(
            id=str(uuid.uuid4()),
            title="Spaghetti Carbonara",
            description="Classic Italian pasta dish with eggs, cheese, and pancetta",
            ingredients=[
                "400g spaghetti",
                "4 large eggs",
                "150g pancetta, diced",
                "50g parmesan cheese, grated",
                "Freshly ground black pepper",
                "Salt to taste"
            ],
            instructions="1. Cook spaghetti al dente\n2. Fry pancetta until crispy\n3. Mix eggs with cheese\n4. Combine everything and serve",
            prep_time=10,
            cook_time=15,
            servings=4
        ),
        Recipe(
            id=str(uuid.uuid4()),
            title="Chocolate Chip Cookies",
            description="Classic homemade chocolate chip cookies",
            ingredients=[
                "2 1/4 cups all-purpose flour",
                "1 cup butter, softened",
                "3/4 cup granulated sugar",
                "3/4 cup brown sugar",
                "2 large eggs",
                "2 cups chocolate chips",
                "1 tsp vanilla extract",
                "1 tsp baking soda",
                "1/2 tsp salt"
            ],
            instructions="1. Cream butter and sugar\n2. Add eggs and vanilla\n3. Mix in dry ingredients\n4. Add chocolate chips\n5. Bake at 350°F for 10-12 minutes",
            prep_time=15,
            cook_time=12,
            servings=24
        )
    ]

    # Add recipes to database
    for recipe in recipes:
        db.session.add(recipe)
    
    # Commit the changes
    db.session.commit() 