-- ============================================================
-- GoalForge Seed Data
-- Demo users, goals, check-ins, and audit logs
-- ============================================================

-- Clear existing data (careful in production!)
TRUNCATE TABLE audit_logs, notifications, checkins, goal_assignments, goals, quarters, cycles, users, departments RESTART IDENTITY CASCADE;

-- ============================================================
-- DEPARTMENTS
-- ============================================================
INSERT INTO departments (id, name, code) VALUES
  ('dept-eng', 'Engineering', 'ENG'),
  ('dept-prd', 'Product', 'PRD'),
  ('dept-des', 'Design', 'DES'),
  ('dept-sal', 'Sales', 'SAL'),
  ('dept-hr', 'HR', 'HR');

-- ============================================================
-- USERS (password: password123)
-- bcrypt hash of "password123"
-- ============================================================
INSERT INTO users (id, name, email, password_hash, role, department_id, status) VALUES
  ('user-admin', 'Admin User', 'admin@goalforge.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin', 'dept-hr', 'Active'),
  ('user-mgr1', 'Bob Smith', 'bob@goalforge.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'manager', 'dept-eng', 'Active'),
  ('user-mgr2', 'Eva Martinez', 'eva@goalforge.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'manager', 'dept-prd', 'Active'),
  ('user-emp1', 'Alice Johnson', 'alice@goalforge.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'employee', 'dept-eng', 'Active'),
  ('user-emp2', 'Carol White', 'carol@goalforge.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'employee', 'dept-des', 'Active'),
  ('user-emp3', 'David Lee', 'david@goalforge.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'employee', 'dept-eng', 'Active');

-- Set manager relationships
UPDATE users SET manager_id = 'user-mgr1' WHERE id IN ('user-emp1', 'user-emp2', 'user-emp3');

-- ============================================================
-- CYCLES
-- ============================================================
INSERT INTO cycles (id, name, fiscal_year, start_date, end_date, goal_setting_deadline, approval_deadline, status, created_by)
VALUES (
  'cycle-fy25',
  'FY 2025-26',
  '2025-26',
  '2025-07-01',
  '2026-06-30',
  '2025-07-31',
  '2025-08-15',
  'Active',
  'user-admin'
);

-- ============================================================
-- QUARTERS
-- ============================================================
INSERT INTO quarters (id, cycle_id, label, start_date, end_date, status) VALUES
  ('q1-fy25', 'cycle-fy25', 'Q1', '2025-07-01', '2025-09-30', 'Active'),
  ('q2-fy25', 'cycle-fy25', 'Q2', '2025-10-01', '2025-12-31', 'Upcoming'),
  ('q3-fy25', 'cycle-fy25', 'Q3', '2026-01-01', '2026-03-31', 'Upcoming'),
  ('q4-fy25', 'cycle-fy25', 'Q4', '2026-04-01', '2026-06-30', 'Upcoming');

-- ============================================================
-- GOALS (Alice Johnson)
-- ============================================================
INSERT INTO goals (id, employee_id, cycle_id, thrust_area, title, description, uom, target, weightage, status) VALUES
  ('goal-1', 'user-emp1', 'cycle-fy25', 'Customer Success', 'Increase Customer Satisfaction Score', 'Achieve 90%+ CSAT in all customer touchpoints', 'Percentage', 90, 20, 'Approved'),
  ('goal-2', 'user-emp1', 'cycle-fy25', 'Learning & Development', 'Complete 5 Product Certifications', 'Earn 5 product/technology certifications by end of FY', 'Numeric', 5, 15, 'Approved'),
  ('goal-3', 'user-emp1', 'cycle-fy25', 'Quality', 'Reduce Bug Backlog', 'Reduce open P1/P2 bugs to under 10', 'Numeric', 10, 20, 'Approved'),
  ('goal-4', 'user-emp1', 'cycle-fy25', 'Delivery', 'Deliver Project X on Schedule', 'Ensure 100% on-time delivery of project milestones', 'Timeline', 100, 25, 'Approved'),
  ('goal-5', 'user-emp1', 'cycle-fy25', 'Finance', 'Revenue Target Q4', 'Contribute to team revenue target of 5L', 'Numeric', 500000, 10, 'Submitted'),
  ('goal-6', 'user-emp1', 'cycle-fy25', 'Operations', 'Zero Critical Incidents', 'Maintain zero P0 incidents throughout the year', 'Zero-based', 0, 10, 'Draft');

-- ============================================================
-- CHECK-INS (Q1 for Alice's approved goals)
-- ============================================================
INSERT INTO checkins (goal_id, employee_id, quarter_id, achievement, status, employee_comment) VALUES
  ('goal-1', 'user-emp1', 'q1-fy25', 82, 'On Track', 'Steady improvement, on track for 90% by year end'),
  ('goal-2', 'user-emp1', 'q1-fy25', 3, 'On Track', 'Two more certifications in progress, scheduled for Q2'),
  ('goal-3', 'user-emp1', 'q1-fy25', 6, 'On Track', 'Bug count reducing week on week with quality gates'),
  ('goal-4', 'user-emp1', 'q1-fy25', 75, 'On Track', 'Major milestones completed, slight delay on module B');

-- ============================================================
-- AUDIT LOGS
-- ============================================================
INSERT INTO audit_logs (user_id, user_name, user_role, action, entity, entity_id, details, prev_value, new_value) VALUES
  ('user-mgr1', 'Bob Smith', 'manager', 'GOAL_APPROVED', 'Goal', 'goal-1', 'Approved Alice Johnson CSAT goal', 'Submitted', 'Approved'),
  ('user-emp1', 'Alice Johnson', 'employee', 'GOAL_SUBMITTED', 'Goal', 'goal-1', 'Goal sheet submitted for approval', 'Draft', 'Submitted'),
  ('user-admin', 'Admin User', 'admin', 'USER_CREATED', 'User', 'user-emp2', 'Created Carol White (Designer)', NULL, 'Active'),
  ('user-admin', 'Admin User', 'admin', 'GOAL_UNLOCKED', 'Goal', 'goal-6', 'Unlocked goal for revision', 'Approved', 'Draft');

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
INSERT INTO notifications (user_id, title, message, type, read) VALUES
  ('user-emp1', 'Goals Approved ✓', 'Bob Smith approved your goals (goal-1 through goal-4)', 'success', false),
  ('user-emp1', 'Q1 Check-In Open', 'Q1 (Jul–Sep) check-in window is now open. Please enter your achievements.', 'info', false),
  ('user-mgr1', 'New Submission', 'Alice Johnson has submitted 6 goals for your review', 'info', true),
  ('user-mgr1', 'Check-In Pending', '3 team members haven''t completed Q1 check-in yet', 'warning', false);

SELECT 'Seed data inserted successfully!' AS status;
