import express       from 'express';
import cors          from 'cors';
import helmet        from 'helmet';
import morgan        from 'morgan';
import cookieParser  from 'cookie-parser';
import { config }         from './config/env.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import { notFound }        from './middleware/notFound.js';
import { apiLimiter }      from './middleware/rateLimiter.js';
import apiRouter           from './routes/index.js';

const app = express();

// ── Security Headers ──────────────────────────────────────────
app.use(helmet());

// ── CORS ──────────────────────────────────────────────────────
app.use(cors({
  origin:      config.clientUrl,
  credentials: true,
  methods:     ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Body Parsing ──────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ── Request Logging ───────────────────────────────────────────
if (config.nodeEnv !== 'test') {
  app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
}

// ── Rate Limiting ─────────────────────────────────────────────
app.use('/api', apiLimiter);

// ── Health Check ──────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success:     true,
    message:     'SchoolERP API is running',
    environment: config.nodeEnv,
    timestamp:   new Date().toISOString(),
    version:     '1.0.0',
  });
});

// ── API Routes ────────────────────────────────────────────────
app.use('/api/v1', apiRouter);

// ── 404 + Global Error Handler ────────────────────────────────
app.use(notFound);
app.use(errorMiddleware);

export default app;
