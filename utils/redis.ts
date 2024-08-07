import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = () => {
    if (process.env.REDIS_URL) {
        console.log('Redis bağlantısı kuruluyor...');
        return new Redis(process.env.REDIS_URL, {
            connectTimeout: 5000, // Bağlantı zaman aşımı süresi (milisaniye cinsinden)
            retryStrategy: times => {
                if (times >= 5) {
                    return null; // 5 denemeden sonra denemeyi bırak
                }
                return Math.min(times * 50, 2000); // Yeniden deneme stratejisi
            },
            tls: {
                rejectUnauthorized: false // Gerekirse false yapın ama güvenlik risklerini unutmayın
            }
        });
    }
    throw new Error('Redis connection failed: Problem burda');
};

export const redis = redisClient();
