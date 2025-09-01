import express, { Express } from 'express'
import { join } from 'path'
import 'dotenv/config'

import '@/infrastructure/logger'
import { mongoose, redis, minio } from '@/dataSources'
import { router } from '@/routes'
import { i18next, i18nextHttpMiddleware } from '@/i18n'
import {corsMiddleware} from "@/middlewares/corsMiddleware";

mongoose.run()
redis.run()
minio.testInstance();
const app: Express = express()

app.use(
  join('/', process.env.STORAGE_PATH),
  express.static(join(__dirname, process.env.STORAGE_PATH))
)

app.use(
  express.json({ limit: '10mb' }),
  express.urlencoded({ limit: '10mb', extended: true }),
  corsMiddleware,
  i18nextHttpMiddleware.handle(i18next),
  router,
)

app.listen(process.env.APP_PORT)
