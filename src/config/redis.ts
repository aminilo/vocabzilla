import { createClient } from 'redis';

const redisClient = createClient({ url: process.env.REDIS_URL });

redisClient.on('error', (err) => console.error('Redis Client Error', err));

redisClient.connect().then(()=> console.log('\t✅ Redis connected')).catch(err=> console.error('\t❌ Redis failed to connect'));

export default redisClient;
