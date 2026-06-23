import 'dotenv/config'
import mongoose from 'mongoose'
import { Recipe } from '../src/models/recipe'
import { Types } from 'mongoose'
import imageMappings from './image-mappings.json'

// Helper function to generate random time up to 5 hours in HH:MM format
function getRandomTime(): string {
  const hours = Math.floor(Math.random() * 6) // 0-5 hours
  const minutes = Math.floor(Math.random() * 60) // 0-59 minutes
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

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
    time: getRandomTime(),
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
    time: getRandomTime(),
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
    time: getRandomTime(),
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
    time: getRandomTime(),
    servings: 2,
    steps: 'Maecenas culpa elit rhoncus sagittis hymenaeos consequatur facere ipsum dignissimos! Sollicitudin, suspendisse, asperiores inventore quos, commodo repellat veniam! Alias dictum! Curabitur taciti ipsa! Nostrud.'
  }
]

// Resolve the target user id for seeding. Priority:
//   1. CLI arg:  npm run seed-recipes -- <userId>   (or -- --userId <userId>)
//   2. Env var:  SEED_USER_ID=<userId> npm run seed-recipes
//   3. Default:  the project owner's known Auth0 id (kept for convenience)
// The id must be a 24-char hex string: it is used directly as a Mongo ObjectId
// and must match the Auth0 `sub` suffix the app stores on users/recipes, or the
// seeded recipes won't show up for the logged-in user.
const DEFAULT_SEED_USER_ID = '689b1b8c4756997569c05972'

function resolveSeedUserId(): string {
  const args = process.argv.slice(2)
  const flagIndex = args.findIndex(a => a === '--userId' || a === '--user-id')
  const fromFlag = flagIndex !== -1 ? args[flagIndex + 1] : undefined
  const fromPositional = args.find(a => !a.startsWith('-'))

  const id = fromFlag ?? fromPositional ?? process.env.SEED_USER_ID ?? DEFAULT_SEED_USER_ID
  const source = fromFlag || fromPositional
    ? 'CLI arg'
    : process.env.SEED_USER_ID
      ? 'SEED_USER_ID env'
      : 'default'

  if (!/^[a-fA-F0-9]{24}$/.test(id)) {
    console.error(`Invalid seed user id "${id}" (source: ${source}). Expected a 24-char hex Auth0 id, e.g. ${DEFAULT_SEED_USER_ID}.`)
    process.exit(1)
  }

  console.log(`Seeding recipes for user ${id} (source: ${source})`)
  return id
}

async function seedRecipes() {
  const userId = new Types.ObjectId(resolveSeedUserId())
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://cookbook-mongo/cookbook')
    console.log('Connected to MongoDB')

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
    await mongoose.connection.close()
    console.log('Database connection closed')
  }
}

// Run the seed function
seedRecipes()

