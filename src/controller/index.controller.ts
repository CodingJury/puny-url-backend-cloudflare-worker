import { Context } from "hono";
import { handleError } from "../utils/helper.util";

export async function BASE(c: Context) {
  return c.text(`
    BACKEND IS LIVE (STATS)
    =======================
    Frontend URL : ${c.env.FRONTEND_URL}
    Connection to DB : 
  `)
}

export async function redirectToFullUrl(c: Context) {
  const { tinyURL } = c.req.param();
  try {
    const redisInstance = c.get("redisInstance")
    const data = await redisInstance.getData(tinyURL);

    if(!data) {
      return handleError(c, {}, 404, "URL not found")
    }

    c.status(302)
    return c.redirect(data);
  } catch(error) {
    return handleError(c, error)
  }
}