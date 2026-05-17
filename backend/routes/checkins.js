const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');

let checkins = [
  { id: '1', goalId: '1', employeeId: '1', quarter: 'Q1', year: 2025, achievement: '82', status: 'On Track', employeeComment: 'Steady improvement', managerComment: '', createdAt: '2025-09-25' },
];

router.get('/goal/:goalId', authenticate, (req, res) => {
  const result = checkins.filter(c => c.goalId === req.params.goalId);
  res.json({ checkins: result });
});

router.get('/team', authenticate, authorize('manager', 'admin'), (req, res) => {
  res.json({ checkins });
});

router.post('/', authenticate, (req, res) => {
  const { goalId, quarter, year, achievement, status, employeeComment } = req.body;
  if (!goalId || !quarter || !achievement || !status) {
    return res.status(400).json({ message: 'Required fields missing' });
  }
  const checkin = {
    id: Date.now().toString(),
    goalId, quarter, year: year || new Date().getFullYear(),
    employeeId: req.user.id,
    achievement, status,
    employeeComment: employeeComment || '',
    managerComment: '',
    createdAt: new Date().toISOString(),
  };
  checkins.push(checkin);
  res.status(201).json({ checkin, message: 'Check-in saved' });
});

router.put('/:id', authenticate, (req, res) => {
  const checkin = checkins.find(c => c.id === req.params.id);
  if (!checkin) return res.status(404).json({ message: 'Check-in not found' });
  const fields = ['achievement', 'status', 'employeeComment', 'managerComment'];
  fields.forEach(f => { if (req.body[f] !== undefined) checkin[f] = req.body[f]; });
  res.json({ checkin, message: 'Check-in updated' });
});

module.exports = router;
