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
