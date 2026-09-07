import dotenv from "dotenv"
dotenv.config()
import { createClient } from 'redis';

const redis = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.HOST_NAME,
        port: process.env.PORT_NAME
    }
});

redis.on('error', err => console.log('Redis Client Error', err));

await redis.connect();

export default redis
