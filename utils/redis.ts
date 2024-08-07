import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = () => {
    if (process.env.REDIS_URL) {
        console.log(`Redis bağlantısı kuruluyor...`);
        return new Redis(process.env.REDIS_URL, {
            connectTimeout: 10000, // Bağlantı zaman aşımı süresi (milisaniye cinsinden)
            retryStrategy: times => Math.min(times * 50, 2000), // Yeniden deneme stratejisi
            tls: {
                rejectUnauthorized: false // Gerekirse false yapın ama güvenlik risklerini unutmayın
            }
        });
    }
    throw new Error('Redis connection failed: Problem burda');
};

export const redis = redisClient();

// Bağlantı başarılı olduğunda
redis.on('connect', () => {
    console.log('Redis bağlantısı başarılı!');
});

// Hata durumunda
redis.on('error', (err) => {
    console.error('Redis bağlantı hatası:', err);
});
