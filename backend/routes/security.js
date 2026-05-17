/**
 * @route   /api/security/*
 * @desc    Admin-only security monitoring endpoints
 * @access  Admin
 */
const express = require('express');
const router  = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  getLockoutStatus,
  unlockAccount,
} = require('../middleware/rateLimit');

/**
 * GET /api/security/lockouts
 * List all currently tracked IP+email combinations (including locked ones)
 */
router.get('/lockouts', authenticate, authorize('admin'), (req, res) => {
  const lockouts = getLockoutStatus();
  const now = Date.now();
  res.json({
    total: lockouts.length,
    activeLockouts: lockouts.filter(l => l.locked).length,
    lockouts,
    serverTime: new Date(now).toISOString(),
  });
});

/**
 * DELETE /api/security/lockouts/:email
 * Manually unlock an account (e.g. when a real user got locked out)
 */
router.delete('/lockouts/:email', authenticate, authorize('admin'), (req, res) => {
  const { email } = req.params;
  unlockAccount(email);
  console.log(`[SECURITY] Admin ${req.user.email} manually unlocked account: ${email}`);
  res.json({ message: `Account unlocked for ${email}` });
});

/**
 * GET /api/security/status
 * Quick health check of security config
 */
router.get('/status', authenticate, authorize('admin'), (req, res) => {
  res.json({
    rateLimiting: {
      global:      { windowMs: '15 min', max: 200, description: 'All /api/* routes' },
      auth:        { windowMs: '15 min', max: 10,  description: '/api/auth/* routes' },
      bruteForce:  { maxAttempts: 5, lockoutMin: 15, progressiveDelayMs: 500 },
    },
    passwordHashing: { algorithm: 'bcrypt', costFactor: 10 },
    jwt: {
      algorithm:  'HS256',
      expiresIn:  process.env.JWT_EXPIRES_IN || '7d',
      issuer:     'goalforge-api',
      audience:   'goalforge-client',
    },
    helmet:   true,
    corsOrigin: process.env.FRONTEND_URL || 'http://localhost:5173',
    trustProxy: true,
  });
});

module.exports = router;
