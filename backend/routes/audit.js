const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');

const auditLogs = [
  { id: '1', timestamp: '2025-07-15T10:23:00Z', userId: '2', userName: 'Bob Smith', userRole: 'manager', action: 'GOAL_APPROVED', entity: 'Goal', entityId: 'G-001', details: 'Approved Alice Johnson goals', prevValue: 'Submitted', newValue: 'Approved' },
  { id: '2', timestamp: '2025-07-15T09:15:00Z', userId: '1', userName: 'Alice Johnson', userRole: 'employee', action: 'GOAL_SUBMITTED', entity: 'Goal', entityId: 'G-001', details: 'Goal sheet submitted', prevValue: 'Draft', newValue: 'Submitted' },
  { id: '3', timestamp: '2025-07-14T16:45:00Z', userId: '3', userName: 'Admin User', userRole: 'admin', action: 'GOAL_UNLOCKED', entity: 'Goal', entityId: 'G-003', details: 'Goal unlocked for revision', prevValue: 'Approved', newValue: 'Draft' },
  { id: '4', timestamp: '2025-07-14T14:30:00Z', userId: '3', userName: 'Admin User', userRole: 'admin', action: 'USER_CREATED', entity: 'User', entityId: 'U-012', details: 'Created Carol White', prevValue: null, newValue: 'Active' },
  { id: '5', timestamp: '2025-07-13T11:00:00Z', userId: '2', userName: 'Bob Smith', userRole: 'manager', action: 'GOAL_REWORK', entity: 'Goal', entityId: 'G-004', details: 'Sent back for rework', prevValue: 'Submitted', newValue: 'Rework' },
];

router.get('/', authenticate, authorize('admin'), (req, res) => {
  const { action, userId, limit = 50, offset = 0 } = req.query;
  let result = [...auditLogs];
  if (action) result = result.filter(l => l.action === action);
  if (userId) result = result.filter(l => l.userId === userId);
  res.json({
    logs: result.slice(Number(offset), Number(offset) + Number(limit)),
    total: result.length,
  });
});

// Helper to add audit log (used internally)
const addAuditLog = (userId, userName, userRole, action, entity, entityId, details, prevValue, newValue) => {
  auditLogs.unshift({
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    userId, userName, userRole, action, entity, entityId, details, prevValue, newValue,
  });
};

module.exports = router;
module.exports.addAuditLog = addAuditLog;
