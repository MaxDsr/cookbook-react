import 'dotenv/config'
import { connect, connection } from 'mongoose'
import { Recipe } from '../models/recipe'
import { Types } from 'mongoose'
import imageMappings from './image-mappings.json'


const recipes = [
  {
    name: 'Baker soup',
    image: { filename: imageMappings['baker-soup'].bucketFileName, etag: imageMappings['baker-soup'].etag },
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
    image: { filename: imageMappings['bolognese-pasta'].bucketFileName, etag: imageMappings['bolognese-pasta'].etag },
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
    image: { filename: imageMappings['french-fries'].bucketFileName, etag: imageMappings['french-fries'].etag },
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
    image: { etag: imageMappings['home-burger'].etag, filename: imageMappings['home-burger'].bucketFileName },
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
