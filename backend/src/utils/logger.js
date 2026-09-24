import { config } from '../config/env.js';

const levels = { error: 0, warn: 1, info: 2, debug: 3 };
const colors = { error: '\x1b[31m', warn: '\x1b[33m', info: '\x1b[36m', debug: '\x1b[90m', reset: '\x1b[0m' };

function log(level, ...args) {
  const isDev = config.nodeEnv !== 'production';
  const prefix = isDev
    ? `${colors[level]}[${level.toUpperCase()}]${colors.reset}`
    : `[${level.toUpperCase()}]`;
  console[level === 'warn' ? 'warn' : level === 'error' ? 'error' : 'log'](
    `${prefix} ${new Date().toISOString()}`,
    ...args,
  );
}

export const logger = {
  error: (...a) => log('error', ...a),
  warn:  (...a) => log('warn',  ...a),
  info:  (...a) => log('info',  ...a),
  debug: (...a) => { if (config.nodeEnv === 'development') log('debug', ...a); },
};
