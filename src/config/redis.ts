import { createClient } from 'redis';

const redisClient = createClient({ url: process.env.REDIS_URL });

redisClient.on('error', (err) => console.error('Redis Client Error', err));

// await redisClient.connect();
redisClient.connect().then(()=> console.log('✅ Redis connected')).catch(err=> console.error('❌ Redis failed to connect'));

export default redisClient;
