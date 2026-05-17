-- ============================================================
-- GoalForge PostgreSQL Schema
-- Enterprise Goal Management System
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- DEPARTMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS departments (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(100) NOT NULL UNIQUE,
  code        VARCHAR(20) NOT NULL UNIQUE,
  head_id     UUID,  -- references users
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            VARCHAR(200) NOT NULL,
  email           VARCHAR(255) NOT NULL UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  role            VARCHAR(20) NOT NULL CHECK (role IN ('employee', 'manager', 'admin')),
  department_id   UUID REFERENCES departments(id) ON DELETE SET NULL,
  manager_id      UUID REFERENCES users(id) ON DELETE SET NULL,
  status          VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Suspended')),
  avatar_url      TEXT,
  employee_code   VARCHAR(50) UNIQUE,
  joining_date    DATE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_manager ON users(manager_id);
CREATE INDEX idx_users_dept ON users(department_id);

-- ============================================================
-- FY CYCLES
-- ============================================================
CREATE TABLE IF NOT EXISTS cycles (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                  VARCHAR(50) NOT NULL UNIQUE,  -- e.g. 'FY 2025-26'
  fiscal_year           VARCHAR(10) NOT NULL,
  start_date            DATE NOT NULL,
  end_date              DATE NOT NULL,
  goal_setting_deadline DATE NOT NULL,
  approval_deadline     DATE NOT NULL,
  status                VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Completed', 'Draft')),
  created_by            UUID REFERENCES users(id),
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- QUARTERS
-- ============================================================
CREATE TABLE IF NOT EXISTS quarters (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cycle_id    UUID NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
  label       VARCHAR(5) NOT NULL,  -- Q1, Q2, Q3, Q4
  start_date  DATE NOT NULL,
  end_date    DATE NOT NULL,
  status      VARCHAR(20) DEFAULT 'Upcoming' CHECK (status IN ('Active', 'Completed', 'Upcoming')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quarters_cycle ON quarters(cycle_id);

-- ============================================================
-- GOALS
-- ============================================================
CREATE TABLE IF NOT EXISTS goals (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cycle_id        UUID NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
  thrust_area     VARCHAR(100) NOT NULL,
  title           VARCHAR(500) NOT NULL,
  description     TEXT,
  uom             VARCHAR(20) NOT NULL CHECK (uom IN ('Numeric', 'Percentage', 'Timeline', 'Zero-based')),
  target          DECIMAL(15, 4) NOT NULL,
  weightage       SMALLINT NOT NULL CHECK (weightage >= 10 AND weightage <= 100),
  status          VARCHAR(20) DEFAULT 'Draft' CHECK (status IN ('Draft', 'Submitted', 'Approved', 'Rejected', 'Rework')),
  is_shared       BOOLEAN DEFAULT FALSE,
  is_locked       BOOLEAN DEFAULT FALSE,
  manager_comment TEXT,
  submitted_at    TIMESTAMPTZ,
  approved_at     TIMESTAMPTZ,
  approved_by     UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_goals_employee ON goals(employee_id);
CREATE INDEX idx_goals_cycle ON goals(cycle_id);
CREATE INDEX idx_goals_status ON goals(status);

-- ============================================================
-- SHARED GOAL ASSIGNMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS goal_assignments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_goal_id  UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  employee_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  weightage       SMALLINT NOT NULL CHECK (weightage >= 10),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(parent_goal_id, employee_id)
);

-- ============================================================
-- QUARTERLY CHECK-INS
-- ============================================================
CREATE TABLE IF NOT EXISTS checkins (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  goal_id             UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  employee_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quarter_id          UUID NOT NULL REFERENCES quarters(id) ON DELETE CASCADE,
  achievement         DECIMAL(15, 4),
  status              VARCHAR(20) DEFAULT 'Not Started' CHECK (status IN ('Not Started', 'On Track', 'Completed')),
  employee_comment    TEXT,
  manager_comment     TEXT,
  reviewed_by         UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at         TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(goal_id, quarter_id)
);

CREATE INDEX idx_checkins_goal ON checkins(goal_id);
CREATE INDEX idx_checkins_employee ON checkins(employee_id);
CREATE INDEX idx_checkins_quarter ON checkins(quarter_id);

-- ============================================================
-- AUDIT LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  user_name   VARCHAR(200),
  user_role   VARCHAR(20),
  action      VARCHAR(100) NOT NULL,
  entity      VARCHAR(50) NOT NULL,
  entity_id   VARCHAR(100),
  details     TEXT,
  prev_value  TEXT,
  new_value   TEXT,
  ip_address  INET,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       VARCHAR(200) NOT NULL,
  message     TEXT NOT NULL,
  type        VARCHAR(20) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  read        BOOLEAN DEFAULT FALSE,
  action_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read);

-- ============================================================
-- TRIGGERS: auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['users', 'goals', 'checkins', 'cycles'] LOOP
    EXECUTE format('CREATE TRIGGER trg_%s_updated BEFORE UPDATE ON %s FOR EACH ROW EXECUTE FUNCTION update_updated_at()', t, t);
  END LOOP;
END $$;
