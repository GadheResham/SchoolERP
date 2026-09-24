import mongoose from 'mongoose';
import { config } from './env.js';
import { logger } from '../utils/logger.js';

export async function connectDB() {
  if (!config.mongoUri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));
  mongoose.connection.on('reconnected',  () => logger.info('MongoDB reconnected'));

  await mongoose.connect(config.mongoUri, {
    serverSelectionTimeoutMS: 5000,
  });

  logger.info(`MongoDB connected → ${mongoose.connection.host}`);
}
