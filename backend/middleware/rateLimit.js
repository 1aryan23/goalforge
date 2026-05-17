/**
 * GoalForge — Rate Limiting & Brute-Force Protection Middleware
 *
 * Layers of protection:
 *   1. Global API rate limiter     — 100 req/15 min per IP (all routes)
 *   2. Auth rate limiter           — 10 req/15 min per IP (login/register)
 *   3. Brute-force tracker         — 5 failures → 15 min lockout per email+IP
 *   4. Account lockout             — tracks failed attempts in-memory (Redis-ready)
 *   5. Progressive delay           — each failure adds exponential delay
 */

const rateLimit = require('express-rate-limit');

// ─────────────────────────────────────────────
// In-memory store for brute-force tracking
// Replace with Redis in production:
//   const { createClient } = require('redis');
// ─────────────────────────────────────────────
const failedAttempts = new Map(); // key: `${ip}:${email}` → { count, lockedUntil, lastAttempt }

const BRUTE_CONFIG = {
  maxAttempts: 5,          // failures before lockout
  lockoutMs: 15 * 60 * 1000, // 15 minutes
  windowMs: 10 * 60 * 1000,  // reset count after 10 min of no attempts
  progressiveDelayMs: 500,    // base delay × attempt count
};

// ─────────────────────────────────────────────
// 1. GLOBAL rate limiter — all /api/* routes
// ─────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 200,                    // 200 requests per window per IP
  standardHeaders: 'draft-7', // RateLimit-* headers (RFC standard)
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many requests. Please wait 15 minutes before trying again.',
    retryAfter: '15 minutes',
  },
  keyGenerator: (req) => {
    // Prefer X-Forwarded-For when behind a proxy (Render, Vercel, nginx)
    return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
  },
  skip: (req) => req.path === '/api/health', // never block health checks
});

// ─────────────────────────────────────────────
// 2. AUTH-specific rate limiter — /api/auth/*
// ─────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 10,                    // only 10 login attempts per 15 min per IP
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many login attempts from this IP. Please wait 15 minutes.',
    retryAfter: '15 minutes',
  },
  keyGenerator: (req) =>
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip,
});

// ─────────────────────────────────────────────
// 3. BRUTE-FORCE middleware — per email + IP
//    Applied only on POST /api/auth/login
// ─────────────────────────────────────────────

function getKey(req, email) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
  return `${ip}:${email?.toLowerCase() || 'unknown'}`;
}

function getAttemptRecord(key) {
  const now = Date.now();
  const record = failedAttempts.get(key);
  if (!record) return { count: 0, lockedUntil: null, lastAttempt: null };
  // Auto-reset if outside window and not locked
  if (record.lastAttempt && now - record.lastAttempt > BRUTE_CONFIG.windowMs && !record.lockedUntil) {
    failedAttempts.delete(key);
    return { count: 0, lockedUntil: null, lastAttempt: null };
  }
  return record;
}

/**
 * Middleware: check if this IP+email is locked before even hitting the DB
 */
const bruteForceCheck = (req, res, next) => {
  const email = req.body?.email;
  const key   = getKey(req, email);
  const record = getAttemptRecord(key);
  const now   = Date.now();

  // Locked out?
  if (record.lockedUntil && now < record.lockedUntil) {
    const remaining = Math.ceil((record.lockedUntil - now) / 1000 / 60);
    return res.status(429).json({
      status: 429,
      message: `Account temporarily locked due to too many failed attempts. Try again in ${remaining} minute${remaining !== 1 ? 's' : ''}.`,
      lockedUntil: new Date(record.lockedUntil).toISOString(),
      attemptsUsed: record.count,
    });
  }

  // Attach helpers to req for use in the route handler
  req._bruteKey = key;
  req._bruteRecord = record;
  next();
};

/**
 * Call after a FAILED login — records the attempt, may lock out
 * Returns the updated record
 */
function recordFailedAttempt(req) {
  const key    = req._bruteKey;
  const record = req._bruteRecord;
  const now    = Date.now();

  const newCount = (record.count || 0) + 1;
  const isLocked = newCount >= BRUTE_CONFIG.maxAttempts;

  const updated = {
    count: newCount,
    lastAttempt: now,
    lockedUntil: isLocked ? now + BRUTE_CONFIG.lockoutMs : null,
  };

  failedAttempts.set(key, updated);

  return {
    attemptsRemaining: Math.max(0, BRUTE_CONFIG.maxAttempts - newCount),
    locked: isLocked,
    lockedUntil: updated.lockedUntil,
    count: newCount,
  };
}

/**
 * Call after a SUCCESSFUL login — clear the failed attempts for this key
 */
function recordSuccessfulLogin(req) {
  if (req._bruteKey) {
    failedAttempts.delete(req._bruteKey);
  }
}

/**
 * Progressive delay — 500ms × attempt number, max 5 seconds
 * Makes automation slow even without a lockout
 */
async function progressiveDelay(count) {
  if (count <= 0) return;
  const delay = Math.min(BRUTE_CONFIG.progressiveDelayMs * count, 5000);
  await new Promise(resolve => setTimeout(resolve, delay));
}

// ─────────────────────────────────────────────
// 4. SUSPICIOUS ACTIVITY LOGGER
//    Logs when someone is close to lockout or hits it
// ─────────────────────────────────────────────
function logSuspiciousActivity(type, req, extra = {}) {
  const ip    = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
  const ua    = req.headers['user-agent'] || 'unknown';
  const email = req.body?.email || 'unknown';
  const ts    = new Date().toISOString();

  const messages = {
    LOCKOUT:      `🔒 LOCKOUT triggered`,
    WARNING:      `⚠️  BRUTE-FORCE WARNING`,
    BLOCKED:      `🚫 BLOCKED — already locked`,
  };

  console.warn(`[SECURITY] ${messages[type] || type} | ${ts} | IP: ${ip} | email: ${email} | UA: ${ua}`, extra);
}

// ─────────────────────────────────────────────
// 5. Helper — expose attempt status in headers
// ─────────────────────────────────────────────
function setAttemptHeaders(res, info) {
  if (info.attemptsRemaining !== undefined) {
    res.setHeader('X-RateLimit-Attempts-Remaining', info.attemptsRemaining);
  }
  if (info.lockedUntil) {
    res.setHeader('X-RateLimit-Locked-Until', new Date(info.lockedUntil).toISOString());
  }
}

// ─────────────────────────────────────────────
// Admin endpoint helper — list all lockouts
// ─────────────────────────────────────────────
function getLockoutStatus() {
  const now = Date.now();
  const result = [];
  for (const [key, record] of failedAttempts.entries()) {
    result.push({
      key,
      count: record.count,
      lastAttempt: record.lastAttempt ? new Date(record.lastAttempt).toISOString() : null,
      locked: record.lockedUntil ? now < record.lockedUntil : false,
      lockedUntil: record.lockedUntil ? new Date(record.lockedUntil).toISOString() : null,
    });
  }
  return result;
}

function unlockAccount(email) {
  for (const key of failedAttempts.keys()) {
    if (key.includes(`:${email.toLowerCase()}`)) {
      failedAttempts.delete(key);
    }
  }
}

module.exports = {
  globalLimiter,
  authLimiter,
  bruteForceCheck,
  recordFailedAttempt,
  recordSuccessfulLogin,
  progressiveDelay,
  logSuspiciousActivity,
  setAttemptHeaders,
  getLockoutStatus,
  unlockAccount,
};
