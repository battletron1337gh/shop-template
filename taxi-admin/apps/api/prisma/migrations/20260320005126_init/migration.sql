-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'user', 'accountant');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('active', 'canceled', 'past_due', 'unpaid', 'trialing');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('free', 'basic', 'pro');

-- CreateEnum
CREATE TYPE "PlatformType" AS ENUM ('uber', 'bolt', 'manual', 'other');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('cash', 'card', 'tikkie', 'other');

-- CreateEnum
CREATE TYPE "ExpenseCategory" AS ENUM ('brandstof', 'onderhoud', 'verzekering', 'wegenvignet', 'parkeerkosten', 'telefoon', 'administratie', 'overig');

-- CreateEnum
CREATE TYPE "VatRate" AS ENUM ('0', '9', '21');

-- CreateEnum
CREATE TYPE "ReceiptStatus" AS ENUM ('pending', 'processing', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('btw_quarterly', 'annual_income', 'expense_summary');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('draft', 'generated', 'submitted');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone" TEXT,
    "kvk_number" TEXT,
    "btw_number" TEXT,
    "address" TEXT,
    "city" TEXT,
    "postal_code" TEXT,
    "birth_date" DATE,
    "kor_scheme_enabled" BOOLEAN NOT NULL DEFAULT false,
    "role" "UserRole" NOT NULL DEFAULT 'user',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "onboarding_completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "plan" "SubscriptionPlan" NOT NULL DEFAULT 'free',
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'trialing',
    "stripe_customer_id" TEXT,
    "stripe_subscription_id" TEXT,
    "stripe_price_id" TEXT,
    "current_period_start" TIMESTAMP(3),
    "current_period_end" TIMESTAMP(3),
    "trial_ends_at" TIMESTAMP(3),
    "canceled_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_connections" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "platform" "PlatformType" NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "token_expires_at" TIMESTAMP(3),
    "external_user_id" TEXT,
    "external_email" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_sync_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rides" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "platform" "PlatformType" NOT NULL,
    "platform_connection_id" UUID,
    "external_ride_id" TEXT,
    "ride_date" DATE NOT NULL,
    "ride_time" TIME,
    "gross_amount" DECIMAL(10,2) NOT NULL,
    "platform_commission" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "net_amount" DECIMAL(10,2) NOT NULL,
    "vat_rate" "VatRate" NOT NULL DEFAULT '0',
    "vat_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "payment_method" "PaymentMethod" NOT NULL DEFAULT 'card',
    "description" TEXT,
    "distance_km" DECIMAL(6,2),
    "duration_minutes" INTEGER,
    "pickup_address" TEXT,
    "destination_address" TEXT,
    "is_manual_entry" BOOLEAN NOT NULL DEFAULT false,
    "synced_from_platform" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "license_plate" TEXT NOT NULL,
    "make" TEXT,
    "model" TEXT,
    "year" INTEGER,
    "fuel_type" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expenses" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "expense_date" DATE NOT NULL,
    "category" "ExpenseCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "vat_rate" "VatRate" NOT NULL DEFAULT '21',
    "vat_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "is_business_expense" BOOLEAN NOT NULL DEFAULT true,
    "is_deductible" BOOLEAN NOT NULL DEFAULT true,
    "receipt_id" UUID,
    "kilometers" INTEGER,
    "vehicle_id" UUID,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receipts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "filename" TEXT NOT NULL,
    "original_filename" TEXT NOT NULL,
    "mime_type" TEXT,
    "file_size" INTEGER,
    "file_path" TEXT NOT NULL,
    "status" "ReceiptStatus" NOT NULL DEFAULT 'pending',
    "extracted_data" JSONB,
    "extracted_amount" DECIMAL(10,2),
    "extracted_vat_amount" DECIMAL(10,2),
    "extracted_date" DATE,
    "extracted_merchant" TEXT,
    "processed_at" TIMESTAMP(3),
    "error_message" TEXT,
    "expense_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "receipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tax_reports" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "report_type" "ReportType" NOT NULL,
    "year" INTEGER NOT NULL,
    "quarter" INTEGER,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "total_income" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_expenses" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "net_profit" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "vat_collected" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "vat_paid" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "vat_payable" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "status" "ReportStatus" NOT NULL DEFAULT 'draft',
    "pdf_url" TEXT,
    "submitted_at" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tax_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" UUID,
    "old_values" JSONB,
    "new_values" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sync_jobs" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "platform" "PlatformType" NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "rides_imported" INTEGER NOT NULL DEFAULT 0,
    "rides_updated" INTEGER NOT NULL DEFAULT 0,
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sync_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "platform_connections_user_id_platform_key" ON "platform_connections"("user_id", "platform");

-- CreateIndex
CREATE INDEX "rides_user_id_idx" ON "rides"("user_id");

-- CreateIndex
CREATE INDEX "rides_ride_date_idx" ON "rides"("ride_date");

-- CreateIndex
CREATE INDEX "rides_user_id_ride_date_idx" ON "rides"("user_id", "ride_date");

-- CreateIndex
CREATE INDEX "expenses_user_id_idx" ON "expenses"("user_id");

-- CreateIndex
CREATE INDEX "expenses_expense_date_idx" ON "expenses"("expense_date");

-- CreateIndex
CREATE INDEX "expenses_user_id_expense_date_idx" ON "expenses"("user_id", "expense_date");

-- CreateIndex
CREATE INDEX "receipts_user_id_idx" ON "receipts"("user_id");

-- CreateIndex
CREATE INDEX "receipts_status_idx" ON "receipts"("status");

-- CreateIndex
CREATE INDEX "tax_reports_user_id_idx" ON "tax_reports"("user_id");

-- CreateIndex
CREATE INDEX "tax_reports_year_quarter_idx" ON "tax_reports"("year", "quarter");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_entity_id_idx" ON "audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "sync_jobs_user_id_idx" ON "sync_jobs"("user_id");

-- CreateIndex
CREATE INDEX "sync_jobs_status_idx" ON "sync_jobs"("status");

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_connections" ADD CONSTRAINT "platform_connections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rides" ADD CONSTRAINT "rides_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rides" ADD CONSTRAINT "rides_platform_connection_id_fkey" FOREIGN KEY ("platform_connection_id") REFERENCES "platform_connections"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_receipt_id_fkey" FOREIGN KEY ("receipt_id") REFERENCES "receipts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receipts" ADD CONSTRAINT "receipts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tax_reports" ADD CONSTRAINT "tax_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sync_jobs" ADD CONSTRAINT "sync_jobs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
