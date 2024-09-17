import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { indexRouter } from './routes/index.routes'
import { urlRouter } from './routes/url.routes'
import { RedisManager } from './managers/redis.manager'

const app = new Hono<{
  Bindings: {
    UPSTASH_REDIS_REST_URL: string,
    UPSTASH_REDIS_REST_TOKEN: string,
    FRONTEND_URL: string
  },
  Variables: {
    redisInstance: any
  }
}>()

// MIDDLEWRE
app.use('*', (c, next) => {
  const corsMiddlewareHandler = cors({
    origin: "*",
    allowMethods: ['GET', 'POST'],
    credentials: true
  })
  return corsMiddlewareHandler(c, next)
})

app.use("*", async (c, next) => {
  const redisInstance = await RedisManager.getInstance({
    redisUrl: c.env.UPSTASH_REDIS_REST_URL,
    redisToken: c.env.UPSTASH_REDIS_REST_TOKEN
  })

  c.set('redisInstance', redisInstance)
  await next()
})

// ROUTER
app.route('/', indexRouter)
app.route('/api/v1/url', urlRouter)

export default app
