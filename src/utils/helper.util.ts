import { Context } from "hono";
import { StatusCode } from "hono/utils/http-status";

export function handleSuccess(c: Context, data: any = null, status: StatusCode = 200) {
  c.status(status)
  return c.json({
    status: 'success',
    data: data,
  });
}

export function handleError(
  c: Context,
  error: any,
  status: StatusCode = 500,
  message = "Internal Server Error"
) {
  console.log(error)
  c.status(status)
  return c.json({
    status: "error",
    message
  })
}