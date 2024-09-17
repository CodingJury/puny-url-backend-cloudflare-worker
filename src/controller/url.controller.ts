import { Context } from "hono";
import { urlSchemaValidator } from "../utils/validator.util";
import { handleError, handleSuccess } from "../utils/helper.util";
import { generateHash } from "../utils/generateHash.util";

export async function listURL(c: Context) {
  try {
    const redisInstance = c.get("redisInstance")
    const redisResponse = await redisInstance.listData()
    return handleSuccess(c, redisResponse)
  } catch(error) {
    return handleError(c, error)
  }
}

export async function addURL(c: Context) {
  const body = await c.req.json();
  try {
    const validator = urlSchemaValidator.safeParse(body);
    if(!validator.success) {
      return handleError(c, validator.error, 403, "URL validation failed")
    }

    const redisInstance = c.get("redisInstance")
    const alreadyPresent = await redisInstance.checkValueExist(validator.data.originalUrl)
    if(alreadyPresent) {
      return handleSuccess(c, "URL already present")
    }

    const shortId = await getUniqueShortId(redisInstance);
    if(shortId) {
      const redisResponse = await redisInstance.addData(shortId, validator.data.originalUrl, validator.data.expire)
      if(redisResponse) {
        return handleSuccess(c, "URL added successfully")
      }else{
        return handleError(c, {}, 500, "Unable to add data into database")  
      }
    } else {
      return handleError(c, {}, 500, "Unable to generate shortId, Please try after some time")
    }
    return handleSuccess(c, body)
  } catch(error) {
    return handleError(c, error)
  }
}

export async function clearAllURL(c: Context) {
  try {
    const redisInstance = c.get("redisInstance")
    const redisResponse = await redisInstance.clearAll()
    return handleSuccess(c, redisResponse)
  } catch(error) {
    return handleError(c, error)
  }
}

async function getUniqueShortId(redisInstance: any) {
  let MAX_ITERATION = 10;
  let shortId = generateHash();

  while (true && --MAX_ITERATION) {
    const found = await redisInstance.getData(shortId);
    if(!found){
      return shortId;
    }
    shortId = generateHash();
  }

  return null;
}