import { Hono } from "hono";
import { BASE, redirectToFullUrl } from "../controller/index.controller";

export const indexRouter = new Hono<{
  Bindings: {},
  Variables: {}
}>()

indexRouter.get('/', BASE)

indexRouter.get('/:tinyURL', redirectToFullUrl)