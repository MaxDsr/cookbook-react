import { Router } from 'express'

import { recipes } from "./recipes"
import { recordUser } from "./recordUser"
import {getUserId} from "../middlewares/getUserId";

const router: Router = Router()

router.use(
  getUserId
)

const routes: {
  [key: string]: (router: Router) => void
} = { recipes, recordUser }

for (const route in routes) {
  routes[route](router)
}

export { router }
