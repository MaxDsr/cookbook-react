import { Router } from 'express'

import { test } from './test'
import { recipes } from "./recipes"

const router: Router = Router()

const routes: {
  [key: string]: (router: Router) => void
} = { test, recipes }

for (const route in routes) {
  routes[route](router)
}

export { router }
