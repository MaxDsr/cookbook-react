import express, { Express } from 'express'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import 'dotenv/config'

import { mongooseDataSource, minio } from './dataSources'
import { router } from './routes'
import { corsMiddleware } from './middlewares/corsMiddleware'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

mongooseDataSource.run()
minio.testInstance()
const app: Express = express()

app.use(
  join('/', process.env.STORAGE_PATH),
  express.static(join(__dirname, process.env.STORAGE_PATH))
)


// Apply body parsers conditionally - skip for multipart/form-data
app.use((req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data')) {
    // Skip body parsing for multipart - let multer handle it
    return next();
  }
  // Apply JSON and URL-encoded parsers for other requests.
	// TODO. chek if this is needed
  express.json({ limit: '10mb' })(req, res, (err) => {
    if (err) return next(err);
    express.urlencoded({ limit: '10mb', extended: true })(req, res, next);
  });
});

app.use(
  '/api',
  corsMiddleware,
  router
)

app.listen(process.env.APP_PORT)
