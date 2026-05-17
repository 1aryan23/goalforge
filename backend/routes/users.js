const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { authenticate, authorize } = require('../middleware/auth');

let users = [
  { id: '1', name: 'Alice Johnson', email: 'alice@goalforge.com', role: 'employee', dept: 'Engineering', managerId: '2', status: 'Active' },
  { id: '2', name: 'Bob Smith', email: 'bob@goalforge.com', role: 'manager', dept: 'Engineering', managerId: null, status: 'Active' },
  { id: '3', name: 'Admin User', email: 'admin@goalforge.com', role: 'admin', dept: 'HR', managerId: null, status: 'Active' },
  { id: '4', name: 'Carol White', email: 'carol@goalforge.com', role: 'employee', dept: 'Design', managerId: '2', status: 'Active' },
  { id: '5', name: 'David Lee', email: 'david@goalforge.com', role: 'employee', dept: 'Engineering', managerId: '2', status: 'Active' },
];

router.get('/', authenticate, authorize('admin', 'manager'), (req, res) => {
  const { role, dept, search } = req.query;
  let result = [...users];
  if (role) result = result.filter(u => u.role === role);
  if (dept) result = result.filter(u => u.dept === dept);
  if (search) result = result.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
  res.json({ users: result, total: result.length });
});

router.get('/team', authenticate, authorize('manager'), (req, res) => {
  const team = users.filter(u => u.managerId === req.user.id);
  res.json({ users: team });
});

router.get('/:id', authenticate, (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user });
});

router.post('/', authenticate, authorize('admin'), async (req, res) => {
  const { name, email, role, dept, managerId, password } = req.body;
  if (!name || !email || !role || !dept) {
    return res.status(400).json({ message: 'Required fields missing' });
  }
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ message: 'Email already exists' });
  }
  const hashedPwd = await bcrypt.hash(password || 'password123', 10);
  const user = { id: Date.now().toString(), name, email, role, dept, managerId: managerId || null, status: 'Active', password: hashedPwd };
  users.push(user);
  const { password: _, ...safeUser } = user;
  res.status(201).json({ user: safeUser, message: 'User created successfully' });
});

router.put('/:id', authenticate, authorize('admin'), (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const allowed = ['name', 'email', 'role', 'dept', 'managerId', 'status'];
  allowed.forEach(f => { if (req.body[f] !== undefined) user[f] = req.body[f]; });
  res.json({ user, message: 'User updated' });
});

router.delete('/:id', authenticate, authorize('admin'), (req, res) => {
  const idx = users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'User not found' });
  users.splice(idx, 1);
  res.json({ message: 'User deleted' });
});

module.exports = router;
