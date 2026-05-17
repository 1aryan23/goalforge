const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');

// Mock data store (replace with PostgreSQL in production)
let goals = [
  { id: '1', employeeId: '1', title: 'Increase CSAT Score', thrustArea: 'Customer Success', description: 'Achieve 90%+ CSAT', uom: 'Percentage', target: '90', weightage: 20, status: 'Approved', achievement: '82', createdAt: '2025-07-01', updatedAt: '2025-07-15' },
  { id: '2', employeeId: '1', title: 'Complete Certifications', thrustArea: 'Learning', description: 'Earn 5 certifications', uom: 'Numeric', target: '5', weightage: 15, status: 'Approved', achievement: '3', createdAt: '2025-07-01', updatedAt: '2025-07-10' },
  { id: '3', employeeId: '4', title: 'Design System v2 Launch', thrustArea: 'Delivery', description: 'Launch new design system', uom: 'Timeline', target: '100', weightage: 40, status: 'Submitted', achievement: '', createdAt: '2025-07-05', updatedAt: '2025-07-18' },
];

/**
 * @route   GET /api/goals
 * @desc    Get all goals (filtered by role)
 * @access  Protected
 */
router.get('/', authenticate, (req, res) => {
  const { employeeId, status, dept } = req.query;
  let result = [...goals];

  if (req.user.role === 'employee') {
    result = result.filter(g => g.employeeId === req.user.id);
  }
  if (employeeId) result = result.filter(g => g.employeeId === employeeId);
  if (status) result = result.filter(g => g.status === status);

  res.json({ goals: result, total: result.length });
});

/**
 * @route   GET /api/goals/:id
 * @desc    Get single goal
 * @access  Protected
 */
router.get('/:id', authenticate, (req, res) => {
  const goal = goals.find(g => g.id === req.params.id);
  if (!goal) return res.status(404).json({ message: 'Goal not found' });
  if (req.user.role === 'employee' && goal.employeeId !== req.user.id) {
    return res.status(403).json({ message: 'Access denied' });
  }
  res.json({ goal });
});

/**
 * @route   POST /api/goals
 * @desc    Create a new goal
 * @access  Employee
 */
router.post('/', authenticate, authorize('employee'), (req, res) => {
  const { title, thrustArea, description, uom, target, weightage } = req.body;

  // Validation
  if (!title || !thrustArea || !target || !weightage) {
    return res.status(400).json({ message: 'Required fields missing' });
  }
  if (weightage < 10) {
    return res.status(400).json({ message: 'Minimum weightage is 10%' });
  }

  const myGoals = goals.filter(g => g.employeeId === req.user.id);
  if (myGoals.length >= 8) {
    return res.status(400).json({ message: 'Maximum 8 goals allowed' });
  }

  const totalWeight = myGoals.reduce((s, g) => s + Number(g.weightage), 0);
  if (totalWeight + Number(weightage) > 100) {
    return res.status(400).json({ message: `Adding ${weightage}% would exceed 100% total (current: ${totalWeight}%)` });
  }

  const newGoal = {
    id: Date.now().toString(),
    employeeId: req.user.id,
    title, thrustArea, description, uom,
    target: String(target),
    weightage: Number(weightage),
    status: 'Draft',
    achievement: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  goals.push(newGoal);
  res.status(201).json({ goal: newGoal, message: 'Goal created successfully' });
});

/**
 * @route   PUT /api/goals/:id
 * @desc    Update a goal (only Draft or Rework goals)
 * @access  Employee (own goals) or Manager (targets/weightage)
 */
router.put('/:id', authenticate, (req, res) => {
  const goal = goals.find(g => g.id === req.params.id);
  if (!goal) return res.status(404).json({ message: 'Goal not found' });

  if (req.user.role === 'employee') {
    if (goal.employeeId !== req.user.id) return res.status(403).json({ message: 'Access denied' });
    if (!['Draft', 'Rework'].includes(goal.status)) {
      return res.status(400).json({ message: 'Goal is locked and cannot be edited' });
    }
  }

  const allowed = ['title', 'thrustArea', 'description', 'uom', 'target', 'weightage', 'achievement'];
  allowed.forEach(field => {
    if (req.body[field] !== undefined) goal[field] = req.body[field];
  });
  goal.updatedAt = new Date().toISOString();

  res.json({ goal, message: 'Goal updated successfully' });
});

/**
 * @route   DELETE /api/goals/:id
 * @desc    Delete a draft goal
 * @access  Employee
 */
router.delete('/:id', authenticate, authorize('employee'), (req, res) => {
  const goal = goals.find(g => g.id === req.params.id);
  if (!goal) return res.status(404).json({ message: 'Goal not found' });
  if (goal.employeeId !== req.user.id) return res.status(403).json({ message: 'Access denied' });
  if (!['Draft', 'Rework'].includes(goal.status)) {
    return res.status(400).json({ message: 'Cannot delete a submitted or approved goal' });
  }
  goals = goals.filter(g => g.id !== req.params.id);
  res.json({ message: 'Goal deleted' });
});

/**
 * @route   POST /api/goals/:id/submit
 * @desc    Submit goals for manager review
 * @access  Employee
 */
router.post('/:id/submit', authenticate, authorize('employee'), (req, res) => {
  const myGoals = goals.filter(g => g.employeeId === req.user.id);
  const totalWeight = myGoals.reduce((s, g) => s + Number(g.weightage), 0);

  if (totalWeight !== 100) {
    return res.status(400).json({ message: `Total weightage must be 100% (currently ${totalWeight}%)` });
  }

  myGoals.filter(g => ['Draft', 'Rework'].includes(g.status)).forEach(g => {
    g.status = 'Submitted';
    g.updatedAt = new Date().toISOString();
  });

  res.json({ message: 'Goals submitted for approval' });
});

/**
 * @route   POST /api/goals/:id/approve
 * @desc    Approve goals
 * @access  Manager
 */
router.post('/:id/approve', authenticate, authorize('manager', 'admin'), (req, res) => {
  const goal = goals.find(g => g.id === req.params.id);
  if (!goal) return res.status(404).json({ message: 'Goal not found' });
  goal.status = 'Approved';
  goal.updatedAt = new Date().toISOString();
  res.json({ goal, message: 'Goal approved' });
});

/**
 * @route   POST /api/goals/:id/reject
 * @desc    Reject goals
 * @access  Manager
 */
router.post('/:id/reject', authenticate, authorize('manager', 'admin'), (req, res) => {
  const goal = goals.find(g => g.id === req.params.id);
  if (!goal) return res.status(404).json({ message: 'Goal not found' });
  goal.status = 'Rejected';
  goal.managerComment = req.body.comment || '';
  goal.updatedAt = new Date().toISOString();
  res.json({ goal, message: 'Goal rejected' });
});

/**
 * @route   POST /api/goals/:id/rework
 * @desc    Return goal for rework
 * @access  Manager
 */
router.post('/:id/rework', authenticate, authorize('manager', 'admin'), (req, res) => {
  const goal = goals.find(g => g.id === req.params.id);
  if (!goal) return res.status(404).json({ message: 'Goal not found' });
  goal.status = 'Rework';
  goal.managerComment = req.body.comment || '';
  goal.updatedAt = new Date().toISOString();
  res.json({ goal, message: 'Goal returned for rework' });
});

/**
 * @route   POST /api/goals/:id/unlock
 * @desc    Unlock an approved goal (admin only)
 * @access  Admin
 */
router.post('/:id/unlock', authenticate, authorize('admin'), (req, res) => {
  const goal = goals.find(g => g.id === req.params.id);
  if (!goal) return res.status(404).json({ message: 'Goal not found' });
  goal.status = 'Draft';
  goal.updatedAt = new Date().toISOString();
  res.json({ goal, message: 'Goal unlocked for revision' });
});

module.exports = router;
