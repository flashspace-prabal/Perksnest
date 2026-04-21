-- Migration: Create payment_history table
-- Description: Stores Razorpay payment transaction history

CREATE TABLE IF NOT EXISTS payment_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  razorpay_payment_id VARCHAR(100) NOT NULL UNIQUE,
  razorpay_order_id VARCHAR(100) NOT NULL,
  amount BIGINT NOT NULL, -- Amount in paise
  currency VARCHAR(10) NOT NULL DEFAULT 'INR',
  status VARCHAR(50) NOT NULL DEFAULT 'success', -- success, failed
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_payment_history_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_payment_history_order FOREIGN KEY (razorpay_order_id) REFERENCES payment_orders(razorpay_order_id) ON DELETE CASCADE
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON payment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_status ON payment_history(status);
CREATE INDEX IF NOT EXISTS idx_payment_history_razorpay_payment_id ON payment_history(razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_created_at ON payment_history(created_at);
