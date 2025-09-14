import 'dotenv/config'
import { connect, connection } from 'mongoose'
import { Recipe } from '../models/recipe'
import { Types } from 'mongoose'

const recipes = [
  {
    name: 'Baker soup',
    image: { filename: 'recipe-6a66d9f7-6110-42b4-8932-f5da8a96220a.jpg', etag: 'cf362a48384a892e81cc3d8eb8873649' },
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
    image: { filename: 'recipe-f6ee1ea3-00a2-4b43-a88c-3b1b76e27c36.jpg', etag: 'b622ea303a5b843f8482c3aea10c5133' },
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
    image: { filename: 'recipe-d06f5de0-9851-4c76-b4fb-06c11247e8f0.jpg', etag: '1aa52fafcc2680a61aecb2fc6299c630' },
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
    image: { etag: '7bfc9e1c8b8efbb9f515224f89a15f3d', filename: 'recipe-f6c28a48-0b6b-41e4-9b68-d3ac4719f2c5.jpg' },
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
    // await connect(process.env.MONGODB_URI || 'mongodb://cookbook-mongo/cookbook')
    await connect('mongodb://localhost:3002/cookbook')
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
