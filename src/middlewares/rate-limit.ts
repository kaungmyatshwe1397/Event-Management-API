import rateLimit from "express-rate-limit";
import Redis from "ioredis";
import {RedisStore} from "rate-limit-redis";

// Build a client to connect with redis
const redisClient = new Redis ({
    host:process.env.REDIS_HOST || "localhost",
    port:Number(process.env.REDIS_PORT) || 6379,
})
redisClient.on("connect",()=>{console.log("Redis connected.")});
redisClient.on("error",(err)=>{console.log("Redis error:",err)});

export const reserveRateLimiter = rateLimit({
    windowMs: 60*1000,
    max: 5,
    standardHeaders:true,
    legacyHeaders:false,
    // Store data by using redis instead of local RAM
    store: new RedisStore({
        sendCommand:(...args:string[])=>redisClient.call(args[0],...args.slice(1)) as Promise<any>,
    }),
    // Handler function if user exceed the rate
    handler:(req,res)=>{
        res.status(429).json({
      error: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests. Try again in 1 minute.",
    });
    }
})