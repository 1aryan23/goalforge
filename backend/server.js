require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');

const { globalLimiter } = require('./middleware/rateLimit');

const app = express();

// ── Security headers ──────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc:  ["'self'"],
      styleSrc:   ["'self'", "'unsafe-inline'"],
      imgSrc:     ["'self'", 'data:'],
    },
  },
}));

// ── CORS ──────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// ── Trust proxy (needed for real IPs behind Render/Vercel) ─
app.set('trust proxy', 1);

// ── Logging ───────────────────────────────────────────────
app.use(morgan('dev'));

// ── Body parsers ──────────────────────────────────────────
app.use(express.json({ limit: '10kb' })); // prevent huge payloads
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── Global rate limiter (200 req / 15 min per IP) ─────────
app.use('/api', globalLimiter);

// ── Routes ────────────────────────────────────────────────
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/goals',         require('./routes/goals'));
app.use('/api/checkins',      require('./routes/checkins'));
app.use('/api/users',         require('./routes/users'));
app.use('/api/analytics',     require('./routes/analytics'));
app.use('/api/audit',         require('./routes/audit'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/security',      require('./routes/security'));   // ← new admin security route

// ── Health check (not rate-limited) ──────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0', timestamp: new Date().toISOString() });
});

// ── 404 handler ───────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ── Global error handler ──────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 GoalForge API  →  http://localhost:${PORT}`);
  console.log(`🛡️  Rate limiting  →  enabled (200/15min global, 10/15min auth)`);
});

module.exports = app;
