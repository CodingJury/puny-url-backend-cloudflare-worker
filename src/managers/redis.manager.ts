import { Redis } from "@upstash/redis/cloudflare";

interface StringKeyValueStore {
  [key: string]: string;
}

export class RedisManager {
  private static instance: RedisManager;
  private redis: Redis;

  private constructor(redisUrl: string, redisToken: string) {
    this.redis = new Redis({
      url: redisUrl,
      token: redisToken
    });
  }

  public static getInstance({redisUrl, redisToken}: {redisUrl: string, redisToken: string}): RedisManager {
    console.log({redisUrl, redisToken})
    if(!RedisManager.instance) {
      RedisManager.instance = new RedisManager(redisUrl, redisToken);
    }
    return RedisManager.instance;
  }

  public async addData(key: string, data: string, expire: "1-month" | "1-day" | "6-hours" | "1-hour" | "1-minute" = '1-day') {
    const timeSecMapping: Record<string, number> = {
      "1-month": 30 * 86400,
      "1-day": 86400,
      "6-hours": 6 * 3600,
      "1-hour": 3600,
      "1-minute": 60,
    };

    try {
      return await this.redis.set(key, data, { ex: timeSecMapping[expire] });
    } catch (error) {
      console.error('Error adding data to Redis:', error);
    }
  }

  public async getData(key: string): Promise<string | null> {
    try {
      return await this.redis.get<string>(key);
    } catch (error) {
      console.error('Error getting data from Redis:', error);
    }
    return null;
  }

  public async listData(): Promise<StringKeyValueStore> {
    try {
      const keys = await this.redis.keys('*');
      const keyValues: StringKeyValueStore = {};

      for (const key of keys) {
        const value = await this.redis.get<string>(key);
        if (value !== null) {
          keyValues[key] = value;
        }
      }

      return keyValues;
    } catch (error) {
      console.error('Error listing data from Redis:', error);
    }
    return {};
  }

  public async checkValueExist(valueToCheck: string): Promise<boolean> {
    try {
      const keys = await this.redis.keys('*');
      for (const key of keys) {
        const value = await this.redis.get<string>(key);
        if (value === valueToCheck) {
          return true;
        }
      }
    } catch (error) {
      console.error('Error checking value existence in Redis:', error);
    }
    return false;
  }

  public async clearAll(): Promise<boolean> {
    try {
      const response = await this.redis.flushall();
      return response === 'OK';
    } catch (error) {
      console.error('Error clearing Redis:', error);
    }
    return false;
  }
}