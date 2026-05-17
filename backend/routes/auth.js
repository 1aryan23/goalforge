const express  = require('express');
const router   = express.Router();
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const { authenticate } = require('../middleware/auth');
const {
  authLimiter,
  bruteForceCheck,
  recordFailedAttempt,
  recordSuccessfulLogin,
  progressiveDelay,
  logSuspiciousActivity,
  setAttemptHeaders,
} = require('../middleware/rateLimit');

// ─── Demo users (replace with PostgreSQL in production) ───
const DEMO_USERS = [
  { id: '1', name: 'Alice Johnson', email: 'alice@goalforge.com', password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', role: 'employee', dept: 'Engineering', managerId: '2' },
  { id: '2', name: 'Bob Smith',     email: 'bob@goalforge.com',   password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', role: 'manager',  dept: 'Engineering', managerId: null },
  { id: '3', name: 'Admin User',    email: 'admin@goalforge.com', password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', role: 'admin',    dept: 'HR',          managerId: null },
  { id: '4', name: 'Carol White',   email: 'carol@goalforge.com', password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', role: 'employee', dept: 'Design',      managerId: '2' },
  { id: '5', name: 'David Lee',     email: 'david@goalforge.com', password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', role: 'employee', dept: 'Engineering', managerId: '2' },
  { id: '6', name: 'Eva Martinez',  email: 'eva@goalforge.com',   password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', role: 'manager',  dept: 'Product',     managerId: null },
];
// All passwords = "password123" (bcrypt salted)

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user, return JWT
 * @access  Public
 *
 * Protection layers applied (in order):
 *   1. authLimiter      — IP-level: max 10 req / 15 min
 *   2. bruteForceCheck  — email+IP: locked after 5 failures for 15 min
 *   3. progressiveDelay — 500ms × failure count added before response
 *   4. bcrypt.compare   — constant-time password check
 *   5. Generic errors   — never reveal "email not found" vs "wrong password"
 */
router.post(
  '/login',
  authLimiter,        // Layer 1: IP rate limit
  bruteForceCheck,    // Layer 2: brute-force lockout check
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // ── Input validation ───────────────────────────────────
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }
      if (typeof email !== 'string' || email.length > 254) {
        return res.status(400).json({ message: 'Invalid email format.' });
      }
      if (typeof password !== 'string' || password.length > 128) {
        return res.status(400).json({ message: 'Invalid password format.' });
      }

      // ── Apply progressive delay based on prior failures ────
      const priorFailures = req._bruteRecord?.count || 0;
      await progressiveDelay(priorFailures); // 0ms, 500ms, 1000ms, 1500ms...

      // ── Look up user ───────────────────────────────────────
      const user = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());

      // ── Always run bcrypt (prevents timing attacks revealing user existence) ─
      // If user not found, compare against a dummy hash so timing is identical
      const DUMMY_HASH = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
      const hashToCompare = user ? user.password : DUMMY_HASH;
      const isValid = await bcrypt.compare(password, hashToCompare);

      if (!user || !isValid) {
        // ── Record failed attempt ──────────────────────────
        const info = recordFailedAttempt(req);
        setAttemptHeaders(res, info);

        // ── Log suspicious activity ────────────────────────
        if (info.locked) {
          logSuspiciousActivity('LOCKOUT', req, { attemptsCount: info.count });
        } else if (info.attemptsRemaining <= 2) {
          logSuspiciousActivity('WARNING', req, { attemptsRemaining: info.attemptsRemaining });
        }

        // ── Generic error — never reveal which field is wrong ─
        const baseMessage = 'Invalid email or password.';
        const hint = info.attemptsRemaining > 0
          ? ` ${info.attemptsRemaining} attempt${info.attemptsRemaining !== 1 ? 's' : ''} remaining before lockout.`
          : ` Account locked for 15 minutes.`;

        return res.status(401).json({
          message: baseMessage + hint,
          attemptsRemaining: info.attemptsRemaining,
        });
      }

      // ── SUCCESS — clear failed attempts ───────────────────
      recordSuccessfulLogin(req);

      // ── Issue JWT ──────────────────────────────────────────
      const payload = {
        id:    user.id,
        email: user.email,
        role:  user.role,
        name:  user.name,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn:  process.env.JWT_EXPIRES_IN || '7d',
        algorithm:  'HS256',
        issuer:     'goalforge-api',
        audience:   'goalforge-client',
      });

      const { password: _, ...safeUser } = user;

      // ── Warn if token expiry is very long ──────────────────
      if (process.env.NODE_ENV === 'production' && (process.env.JWT_EXPIRES_IN || '7d') === '30d') {
        console.warn('[SECURITY] JWT_EXPIRES_IN is set to 30d — consider shortening in production.');
      }

      return res.status(200).json({
        token,
        user: safeUser,
        message: 'Login successful',
      });

    } catch (err) {
      console.error('[AUTH] Login error:', err.message);
      return res.status(500).json({ message: 'Authentication service error. Please try again.' });
    }
  }
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user profile
 * @access  Protected (JWT required)
 */
router.get('/me', authenticate, (req, res) => {
  const user = DEMO_USERS.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found.' });
  const { password: _, ...safeUser } = user;
  return res.status(200).json({ user: safeUser });
});

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change user password
 * @access  Protected
 */
router.put('/change-password', authenticate, authLimiter, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new password are required.' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters.' });
    }
    if (newPassword.length > 128) {
      return res.status(400).json({ message: 'Password too long.' });
    }
    // Common weak passwords check
    const weak = ['password', 'password123', '12345678', 'qwerty123'];
    if (weak.includes(newPassword.toLowerCase())) {
      return res.status(400).json({ message: 'Password is too common. Choose a stronger one.' });
    }

    const user = DEMO_USERS.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) return res.status(401).json({ message: 'Current password is incorrect.' });

    // In production: hash and save to DB
    // user.password = await bcrypt.hash(newPassword, 12);
    console.log(`[AUTH] Password change requested by user ${req.user.id}`);

    return res.status(200).json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error('[AUTH] Change-password error:', err.message);
    return res.status(500).json({ message: 'Server error.' });
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout (client should delete token; server logs it)
 * @access  Protected
 */
router.post('/logout', authenticate, (req, res) => {
  // In production with refresh tokens: revoke refresh token here
  console.log(`[AUTH] User ${req.user.id} (${req.user.email}) logged out`);
  return res.status(200).json({ message: 'Logged out successfully.' });
});

module.exports = router;
