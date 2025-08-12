import 'dotenv/config'
import { connect, connection } from 'mongoose'
import { Recipe } from '../models/recipe'
import { Types } from 'mongoose'

const recipes = [
  {
    name: 'Baker soup',
    imageUrl: 'https://pbs.twimg.com/media/Cs30RK-UkAAvl3V.jpg',
    ingredients: [
      'potato',
      'tomato',
      'bachato with parrots',
      'brocoli',
      'onion'
    ],
    time: '1h 30min',
    servings: 2,
    steps: 'Maecenas culpa elit rhoncus sagittis hymenaeos consequatur facere ipsum dignissimos! Sollicitudin, suspendisse, asperiores inventore quos, commodo repellat veniam! Alias dictum! Curabitur taciti ipsa! Nostrud.'
  },
  {
    name: 'Bolognese pasta',
    imageUrl: 'https://tmbidigitalassetsazure.blob.core.windows.net/rms3-prod/attachments/37/1200x1200/Beef-Bolognese-with-Linguine_EXPS_FT21_130403_F_0423_1.jpg',
    ingredients: [
      'potato',
      'tomato',
      'bachato',
      'brocoli',
      'onion'
    ],
    time: '1h 30min',
    servings: 4,
    steps: 'Maecenas culpa elit rhoncus sagittis hymenaeos consequatur facere ipsum dignissimos! Sollicitudin, suspendisse, asperiores inventore quos, commodo repellat veniam! Alias dictum! Curabitur taciti ipsa! Nostrud.'
  },
  {
    name: 'French fries',
    imageUrl: 'https://www.thespruceeats.com/thmb/IHKuXcx3uUI1IWkM_cnnQdFH-zQ=/3485x2323/filters:fill(auto,1)/how-to-make-homemade-french-fries-2215971-hero-01-02f62a016f3e4aa4b41d0c27539885c3.jpg',
    ingredients: [
      'potato',
      'tomato',
      'bachato',
      'brocoli',
      'onion'
    ],
    time: '1h 30min',
    servings: 4,
    steps: 'Maecenas culpa elit rhoncus sagittis hymenaeos consequatur facere ipsum dignissimos! Sollicitudin, suspendisse, asperiores inventore quos, commodo repellat veniam! Alias dictum! Curabitur taciti ipsa! Nostrud.'
  },
  {
    name: 'Home burger',
    imageUrl: 'https://live.staticflickr.com/5058/5519067595_6fe442ee19_b.jpg',
    ingredients: [
      'potato',
      'tomato',
      'bachato',
      'brocoli',
      'onion'
    ],
    time: '1h 30min',
    servings: 2,
    steps: 'Maecenas culpa elit rhoncus sagittis hymenaeos consequatur facere ipsum dignissimos! Sollicitudin, suspendisse, asperiores inventore quos, commodo repellat veniam! Alias dictum! Curabitur taciti ipsa! Nostrud.'
  }
]

async function seedRecipes() {
  try {
    // Connect to MongoDB
    await connect(process.env.MONGODB_URI || 'mongodb://cookbook-mongo/cookbook')
    console.log('Connected to MongoDB')

    // Hardcoded userId
    const userId = new Types.ObjectId('689b1b8c4756997569c05972')

    // Clear existing recipes for this user
    await Recipe.deleteMany({ userId })
    console.log('Cleared existing recipes for user')

    // Create new recipes
    const recipesWithUserId = recipes.map(recipe => ({
      ...recipe,
      userId
    }))

    const createdRecipes = await Recipe.insertMany(recipesWithUserId)
    console.log(`Successfully seeded ${createdRecipes.length} recipes`)

    // Log created recipes
    createdRecipes.forEach((recipe, index) => {
      console.log(`${index + 1}. ${recipe.name} - ${recipe.servings} servings`)
    })

  } catch (error) {
    console.error('Error seeding recipes:', error)
    process.exit(1)
  } finally {
    // Close database connection
    await connection.close()
    console.log('Database connection closed')
  }
}

// Run the seed function
seedRecipes()
