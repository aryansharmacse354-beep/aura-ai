import rateLimit from 'express-rate-limit';

export const generalApiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 180, // Limit each IP to 180 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please slow down your request rate.' }
});

export const aiApiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 50, // Limit AI queries to 50/minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Atmospheric AI query quota threshold reached for this minute. Please wait a moment.' }
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit login/register attempts
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Please try again after 15 minutes.' }
});
