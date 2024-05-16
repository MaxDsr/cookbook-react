import { Router } from 'express'

import { test } from './test'
import { recipes } from "./recipes"
import { recordUser } from "./recordUser"

const router: Router = Router()

const routes: {
  [key: string]: (router: Router) => void
} = { test, recipes, recordUser }

for (const route in routes) {
  routes[route](router)
}

export { router }
