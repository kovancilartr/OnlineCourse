"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const redisClient = () => {
    if (process.env.REDIS_URL) {
        console.log('Redis bağlantısı kuruluyor...');
        return new ioredis_1.default(process.env.REDIS_URL, {
            connectTimeout: 5000,
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
exports.redis = redisClient();
// Bağlantı başarılı olduğunda
exports.redis.on('connect', () => {
    console.log('Redis bağlantısı başarılı!');
});
// Hata durumunda
exports.redis.on('error', (err) => {
    console.error('Redis bağlantı hatası:', err);
});
// Test fonksiyonu
const testRedisConnection = async () => {
    try {
        // Redis'e bir anahtar ayarla
        await exports.redis.set('test_key', 'test_value');
        console.log('Anahtar başarıyla ayarlandı');
        // Anahtarı oku
        const value = await exports.redis.get('test_key');
        console.log('Anahtar değeri:', value);
    }
    catch (error) {
        console.error('Redis testinde hata:', error);
    }
    finally {
        // Redis bağlantısını kapat
        exports.redis.disconnect();
    }
};
// Vercel timeout sorunu nedeniyle async/await kullanmayalım
testRedisConnection();
