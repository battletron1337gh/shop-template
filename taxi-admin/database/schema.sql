-- ============================================================
-- TaxiBoek: Dutch Taxi Driver Accounting System
-- Database Schema - PostgreSQL
-- ============================================================
-- Run this in order: extensions → tables → indexes → triggers → seed data

-- ============================================================
-- 1. EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 2. ENUMS
-- ============================================================
CREATE TYPE user_role AS ENUM ('admin', 'user', 'accountant');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'unpaid', 'trialing');
CREATE TYPE subscription_plan AS ENUM ('free', 'basic', 'pro');
CREATE TYPE platform_type AS ENUM ('uber', 'bolt', 'manual', 'other');
CREATE TYPE payment_method AS ENUM ('cash', 'card', 'tikkie', 'other');
CREATE TYPE expense_category AS ENUM (
    'brandstof',
    'onderhoud',
    'verzekering',
    'wegenvignet',
    'parkeerkosten',
    'telefoon',
    'administratie',
    'overig'
);
CREATE TYPE vat_rate AS ENUM ('0', '9', '21');
CREATE TYPE receipt_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE report_type AS ENUM ('btw_quarterly', 'annual_income', 'expense_summary');
CREATE TYPE report_status AS ENUM ('draft', 'generated', 'submitted');

-- ============================================================
-- 3. TABLES
-- ============================================================

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    kvk_number VARCHAR(20), -- Chamber of Commerce number
    btw_number VARCHAR(20), -- VAT number
    address VARCHAR(255),
    city VARCHAR(100),
    postal_code VARCHAR(10),
    birth_date DATE,
    kor_scheme_enabled BOOLEAN DEFAULT FALSE, -- KOR = Kleine Ondernemersregeling
    role user_role DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan subscription_plan DEFAULT 'free',
    status subscription_status DEFAULT 'trialing',
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    stripe_price_id VARCHAR(255),
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    canceled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Platform connections (Uber, Bolt, etc.)
CREATE TABLE platform_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform platform_type NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP WITH TIME ZONE,
    external_user_id VARCHAR(255), -- Driver ID from platform
    external_email VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, platform)
);

-- Rides table
CREATE TABLE rides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform platform_type NOT NULL,
    platform_connection_id UUID REFERENCES platform_connections(id),
    external_ride_id VARCHAR(255), -- ID from Uber/Bolt API
    ride_date DATE NOT NULL,
    ride_time TIME,
    gross_amount DECIMAL(10, 2) NOT NULL, -- Bruto bedrag
    platform_commission DECIMAL(10, 2) DEFAULT 0, -- Platform kosten
    net_amount DECIMAL(10, 2) NOT NULL, -- Netto bedrag
    vat_rate vat_rate DEFAULT '0',
    vat_amount DECIMAL(10, 2) DEFAULT 0,
    payment_method payment_method DEFAULT 'card',
    description TEXT,
    distance_km DECIMAL(6, 2),
    duration_minutes INTEGER,
    pickup_address VARCHAR(500),
    destination_address VARCHAR(500),
    is_manual_entry BOOLEAN DEFAULT FALSE,
    synced_from_platform BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expenses table
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expense_date DATE NOT NULL,
    category expense_category NOT NULL,
    description VARCHAR(500) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    vat_rate vat_rate DEFAULT '21',
    vat_amount DECIMAL(10, 2) DEFAULT 0,
    is_business_expense BOOLEAN DEFAULT TRUE,
    is_deductible BOOLEAN DEFAULT TRUE,
    receipt_id UUID,
    kilometers INTEGER, -- For travel expenses
    vehicle_id UUID,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Receipts table (for AI processing)
CREATE TABLE receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100),
    file_size INTEGER,
    file_path VARCHAR(500) NOT NULL,
    status receipt_status DEFAULT 'pending',
    extracted_data JSONB, -- AI extraction results
    extracted_amount DECIMAL(10, 2),
    extracted_vat_amount DECIMAL(10, 2),
    extracted_date DATE,
    extracted_merchant VARCHAR(255),
    processed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    expense_id UUID REFERENCES expenses(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key to expenses after receipts table exists
ALTER TABLE expenses ADD CONSTRAINT fk_expense_receipt 
    FOREIGN KEY (receipt_id) REFERENCES receipts(id) ON DELETE SET NULL;

-- Vehicles table
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    license_plate VARCHAR(20) NOT NULL,
    make VARCHAR(100),
    model VARCHAR(100),
    year INTEGER,
    fuel_type VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key to expenses
ALTER TABLE expenses ADD CONSTRAINT fk_expense_vehicle 
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL;

-- Tax reports table
CREATE TABLE tax_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    report_type report_type NOT NULL,
    year INTEGER NOT NULL,
    quarter INTEGER, -- 1-4 for quarterly reports
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_income DECIMAL(12, 2) DEFAULT 0,
    total_expenses DECIMAL(12, 2) DEFAULT 0,
    net_profit DECIMAL(12, 2) DEFAULT 0,
    vat_collected DECIMAL(10, 2) DEFAULT 0,
    vat_paid DECIMAL(10, 2) DEFAULT 0,
    vat_payable DECIMAL(10, 2) DEFAULT 0,
    status report_status DEFAULT 'draft',
    pdf_url VARCHAR(500),
    submitted_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sync jobs table (for background processing)
CREATE TABLE sync_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform platform_type NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, running, completed, failed
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    rides_imported INTEGER DEFAULT 0,
    rides_updated INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 4. INDEXES
-- ============================================================
-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active);

-- Subscriptions
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Platform connections
CREATE INDEX idx_platform_user ON platform_connections(user_id);
CREATE INDEX idx_platform_type ON platform_connections(platform);

-- Rides
CREATE INDEX idx_rides_user ON rides(user_id);
CREATE INDEX idx_rides_date ON rides(ride_date);
CREATE INDEX idx_rides_platform ON rides(platform);
CREATE INDEX idx_rides_user_date ON rides(user_id, ride_date);
CREATE INDEX idx_rides_external ON rides(external_ride_id) WHERE external_ride_id IS NOT NULL;

-- Expenses
CREATE INDEX idx_expenses_user ON expenses(user_id);
CREATE INDEX idx_expenses_date ON expenses(expense_date);
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_user_date ON expenses(user_id, expense_date);

-- Receipts
CREATE INDEX idx_receipts_user ON receipts(user_id);
CREATE INDEX idx_receipts_status ON receipts(status);
CREATE INDEX idx_receipts_expense ON receipts(expense_id) WHERE expense_id IS NOT NULL;

-- Tax reports
CREATE INDEX idx_tax_reports_user ON tax_reports(user_id);
CREATE INDEX idx_tax_reports_year_quarter ON tax_reports(year, quarter);

-- Audit logs
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at);

-- Sync jobs
CREATE INDEX idx_sync_jobs_user ON sync_jobs(user_id);
CREATE INDEX idx_sync_jobs_status ON sync_jobs(status);

-- ============================================================
-- 5. FUNCTIONS & TRIGGERS
-- ============================================================

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_platform_connections_updated_at BEFORE UPDATE ON platform_connections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rides_updated_at BEFORE UPDATE ON rides
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tax_reports_updated_at BEFORE UPDATE ON tax_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Calculate VAT amount on rides
CREATE OR REPLACE FUNCTION calculate_ride_vat()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.vat_rate = '9' THEN
        NEW.vat_amount := ROUND((NEW.net_amount * 0.09)::numeric, 2);
    ELSIF NEW.vat_rate = '21' THEN
        NEW.vat_amount := ROUND((NEW.net_amount * 0.21)::numeric, 2);
    ELSE
        NEW.vat_amount := 0;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER calculate_ride_vat BEFORE INSERT OR UPDATE ON rides
    FOR EACH ROW EXECUTE FUNCTION calculate_ride_vat();

-- Calculate VAT amount on expenses
CREATE OR REPLACE FUNCTION calculate_expense_vat()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.vat_rate = '9' THEN
        NEW.vat_amount := ROUND((NEW.amount * 0.09)::numeric, 2);
    ELSIF NEW.vat_rate = '21' THEN
        NEW.vat_amount := ROUND((NEW.amount * 0.21)::numeric, 2);
    ELSE
        NEW.vat_amount := 0;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER calculate_expense_vat BEFORE INSERT OR UPDATE ON expenses
    FOR EACH ROW EXECUTE FUNCTION calculate_expense_vat();

-- ============================================================
-- 6. VIEWS
-- ============================================================

-- Monthly summary view
CREATE VIEW monthly_summary AS
SELECT 
    user_id,
    DATE_TRUNC('month', ride_date)::date AS month,
    COUNT(*) FILTER (WHERE platform = 'uber') AS uber_rides,
    COUNT(*) FILTER (WHERE platform = 'bolt') AS bolt_rides,
    COUNT(*) FILTER (WHERE is_manual_entry = TRUE) AS manual_rides,
    SUM(net_amount) AS total_income,
    SUM(vat_amount) AS vat_on_income
FROM rides
GROUP BY user_id, DATE_TRUNC('month', ride_date);

-- Expense summary by category
CREATE VIEW expense_summary AS
SELECT 
    user_id,
    DATE_TRUNC('month', expense_date)::date AS month,
    category,
    SUM(amount) AS total_amount,
    SUM(vat_amount) AS vat_on_expenses
FROM expenses
WHERE is_business_expense = TRUE
GROUP BY user_id, DATE_TRUNC('month', expense_date), category;

-- Quarterly VAT overview
CREATE VIEW quarterly_vat_overview AS
SELECT 
    r.user_id,
    EXTRACT(YEAR FROM r.ride_date)::int AS year,
    EXTRACT(QUARTER FROM r.ride_date)::int AS quarter,
    SUM(r.vat_amount) AS vat_received,
    COALESCE((
        SELECT SUM(e.vat_amount) 
        FROM expenses e 
        WHERE e.user_id = r.user_id 
        AND EXTRACT(YEAR FROM e.expense_date) = EXTRACT(YEAR FROM r.ride_date)
        AND EXTRACT(QUARTER FROM e.expense_date) = EXTRACT(QUARTER FROM r.ride_date)
        AND e.is_deductible = TRUE
    ), 0) AS vat_paid,
    SUM(r.vat_amount) - COALESCE((
        SELECT SUM(e.vat_amount) 
        FROM expenses e 
        WHERE e.user_id = r.user_id 
        AND EXTRACT(YEAR FROM e.expense_date) = EXTRACT(YEAR FROM r.ride_date)
        AND EXTRACT(QUARTER FROM e.expense_date) = EXTRACT(QUARTER FROM r.ride_date)
        AND e.is_deductible = TRUE
    ), 0) AS vat_payable
FROM rides r
GROUP BY r.user_id, EXTRACT(YEAR FROM r.ride_date), EXTRACT(QUARTER FROM r.ride_date);

-- ============================================================
-- 7. SEED DATA (Optional)
-- ============================================================

-- Insert test admin user (password: admin123)
-- In production, use proper password hashing
-- INSERT INTO users (email, password_hash, first_name, last_name, role)
-- VALUES ('admin@taxiboek.nl', crypt('admin123', gen_salt('bf')), 'Admin', 'User', 'admin');

-- ============================================================
-- 8. COMMENTS
-- ============================================================

COMMENT ON TABLE users IS 'Gebruikers (taxi chauffeurs)';
COMMENT ON TABLE subscriptions IS 'Abonnementen en betalingsstatus';
COMMENT ON TABLE rides IS 'Ritten - zowel geïmporteerd als handmatig ingevoerd';
COMMENT ON TABLE expenses IS 'Zakelijke uitgaven en kosten';
COMMENT ON TABLE receipts IS 'Bonnetjes en facturen voor AI verwerking';
COMMENT ON TABLE tax_reports IS 'Belastingaangiften en rapportages';
COMMENT ON TABLE platform_connections IS 'OAuth verbindingen met Uber, Bolt, etc.';
COMMENT ON TABLE vehicles IS 'Voertuigen van de chauffeur';
COMMENT ON TABLE audit_logs IS 'Audit log voor wijzigingen';
COMMENT ON TABLE sync_jobs IS 'Achtergrond synchronisatie jobs';

COMMENT ON COLUMN rides.gross_amount IS 'Bruto bedrag van de rit';
COMMENT ON COLUMN rides.platform_commission IS 'Commissie die het platform inhoudt';
COMMENT ON COLUMN rides.net_amount IS 'Netto bedrag dat de chauffeur ontvangt';
COMMENT ON COLUMN users.kor_scheme_enabled IS 'Kleine Ondernemers Regeling - vrijgesteld van BTW afdracht';
