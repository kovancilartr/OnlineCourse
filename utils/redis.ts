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

// Bağlantı başarılı olduğunda
redis.on('connect', () => {
    console.log('Redis bağlantısı başarılı!');
});

// Hata durumunda
redis.on('error', (err) => {
    console.error('Redis bağlantı hatası:', err);
});

// Test fonksiyonu
const testRedisConnection = async () => {
    try {
        // Redis'e bir anahtar ayarla
        await redis.set('test_key', 'test_value');
        console.log('Anahtar başarıyla ayarlandı');

        // Anahtarı oku
        const value = await redis.get('test_key');
        console.log('Anahtar değeri:', value);
    } catch (error) {
        console.error('Redis testinde hata:', error);
    } finally {
        // Redis bağlantısını kapat
        redis.disconnect();
    }
};

// Vercel timeout sorunu nedeniyle async/await kullanmayalım
testRedisConnection();
