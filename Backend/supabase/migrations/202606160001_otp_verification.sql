-- =============================================================
-- YUM YUM v2 - OTP Verification
-- =============================================================

ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS otp_code VARCHAR(6) DEFAULT NULL;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS otp_expires TIMESTAMPTZ DEFAULT NULL;
