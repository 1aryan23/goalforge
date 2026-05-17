const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');

// Mock analytics data
router.get('/employee', authenticate, authorize('employee'), (req, res) => {
  res.json({
    totalGoals: 6, approvedGoals: 4, pendingGoals: 1, draftGoals: 1,
    overallProgress: 68, weightageUsed: 100,
    goalsByStatus: { Draft: 1, Submitted: 0, Approved: 4, Pending: 1, Rejected: 0 },
    quarterlyTrend: [
      { quarter: 'Q1 FY24', score: 72 }, { quarter: 'Q2 FY24', score: 65 },
      { quarter: 'Q3 FY24', score: 78 }, { quarter: 'Q4 FY24', score: 82 },
      { quarter: 'Q1 FY25', score: 68 },
    ],
  });
});

router.get('/manager', authenticate, authorize('manager'), (req, res) => {
  res.json({
    teamSize: 5, goalsSubmitted: 32, goalsApproved: 27,
    avgProgress: 70, pendingApprovals: 4,
    teamMembers: [
      { name: 'Alice Johnson', progress: 82 }, { name: 'Bob Smith', progress: 71 },
      { name: 'Carol White', progress: 45 }, { name: 'David Lee', progress: 90 },
      { name: 'Eva Martinez', progress: 60 },
    ],
  });
});

router.get('/admin', authenticate, authorize('admin'), (req, res) => {
  res.json({
    totalEmployees: 124, totalGoals: 182, approvalRate: 88, avgProgress: 72,
    byDepartment: [
      { dept: 'Engineering', goals: 48, avg: 74 }, { dept: 'Product', goals: 32, avg: 81 },
      { dept: 'Design', goals: 18, avg: 58 }, { dept: 'Sales', goals: 40, avg: 88 },
      { dept: 'HR', goals: 12, avg: 92 },
    ],
  });
});

router.get('/trends', authenticate, (req, res) => {
  res.json({
    trends: [
      { quarter: 'Q1 FY24', score: 68 }, { quarter: 'Q2 FY24', score: 72 },
      { quarter: 'Q3 FY24', score: 75 }, { quarter: 'Q4 FY24', score: 82 },
      { quarter: 'Q1 FY25', score: 74 },
    ],
  });
});

router.get('/team-comparison', authenticate, authorize('manager', 'admin'), (req, res) => {
  res.json({
    comparison: [
      { name: 'Alice', q1: 82 }, { name: 'Bob', q1: 71 },
      { name: 'Carol', q1: 45 }, { name: 'David', q1: 90 }, { name: 'Eva', q1: 60 },
    ],
  });
});

router.get('/departments', authenticate, authorize('admin'), (req, res) => {
  res.json({
    departments: [
      { dept: 'Engineering', avg: 74, employees: 45, goals: 48 },
      { dept: 'Product', avg: 81, employees: 18, goals: 32 },
      { dept: 'Design', avg: 58, employees: 12, goals: 18 },
      { dept: 'Sales', avg: 88, employees: 32, goals: 40 },
      { dept: 'HR', avg: 92, employees: 8, goals: 12 },
    ],
  });
});

module.exports = router;
