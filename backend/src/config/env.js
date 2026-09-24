// Centralised environment variable access.
// NEVER read process.env directly anywhere else in the codebase.
export const config = {
  port:        process.env.PORT         || 5000,
  mongoUri:    process.env.MONGODB_URI  || '',
  jwtSecret:   process.env.JWT_SECRET   || 'change_me_in_production_min_32_chars!!',
  jwtExpires:  process.env.JWT_EXPIRES  || '7d',
  clientUrl:   process.env.CLIENT_URL   || 'http://localhost:5173',
  nodeEnv:     process.env.NODE_ENV     || 'development',
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS) || 12,
};
