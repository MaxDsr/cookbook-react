import { Router } from 'express'

import { auth } from './auth'
import { users } from './users'
import { media } from './media'
import { test } from './test'
import { recipes } from "./recipes"

const router: Router = Router()

const routes: {
  [key: string]: (router: Router) => void
} = { auth, users, media, test, recipes }

for (const route in routes) {
  routes[route](router)
}

export { router }
