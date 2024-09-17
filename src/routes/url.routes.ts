import { Hono } from "hono";
import { listURL, addURL, clearAllURL } from "../controller/url.controller";

export const urlRouter = new Hono<{
  Bindings: {},
  Variables: {
    redisInstance: any
  }
}>()

urlRouter.get('/', listURL)
urlRouter.post('/', addURL)
urlRouter.delete('/', clearAllURL)