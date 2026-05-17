const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

let notifications = [
  { id: '1', userId: '1', title: 'Goals Approved', message: 'Your goal "Increase CSAT Score" has been approved by Bob Smith', type: 'success', read: false, createdAt: '2025-07-15T10:23:00Z' },
  { id: '2', userId: '1', title: 'Rework Required', message: 'Your goal "Revenue Target" needs revision. Manager comment: Adjust target to team allocation.', type: 'warning', read: false, createdAt: '2025-07-13T11:00:00Z' },
  { id: '3', userId: '2', title: 'New Submission', message: 'Alice Johnson has submitted goals for your review (6 goals)', type: 'info', read: true, createdAt: '2025-07-10T09:00:00Z' },
];

router.get('/', authenticate, (req, res) => {
  const userNotifs = notifications.filter(n => n.userId === req.user.id);
  res.json({ notifications: userNotifs, unreadCount: userNotifs.filter(n => !n.read).length });
});

router.put('/:id/read', authenticate, (req, res) => {
  const notif = notifications.find(n => n.id === req.params.id && n.userId === req.user.id);
  if (!notif) return res.status(404).json({ message: 'Notification not found' });
  notif.read = true;
  res.json({ message: 'Marked as read' });
});

router.put('/read-all', authenticate, (req, res) => {
  notifications.filter(n => n.userId === req.user.id).forEach(n => n.read = true);
  res.json({ message: 'All notifications marked as read' });
});

module.exports = router;
