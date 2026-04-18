// Test setup and utilities
require('dotenv').config({ path: '.env.test' });

// Mock Supabase for testing
const mockSupabaseAuth = {
  signUp: jest.fn(),
  signInWithPassword: jest.fn(),
  signInWithOAuth: jest.fn(),
  signOut: jest.fn(),
  getSession: jest.fn(),
  getUser: jest.fn(),
  updateUser: jest.fn(),
};

const mockSupabaseData = {
  from: jest.fn((table) => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    match: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    data: [],
    error: null,
  })),
};

// Setup environment
process.env.NODE_ENV = 'test';
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_KEY = 'test-service-key';
process.env.JWT_SECRET = 'test-jwt-secret';

// Global test utilities
global.testUtils = {
  mockSupabaseAuth,
  mockSupabaseData,
  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  generateTestEmail: () => `test-${Date.now()}@example.com`,
  generateTestToken: (userId) => {
    const jwt = require('jsonwebtoken');
    return jwt.sign({ sub: userId, email: 'test@example.com' }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });
  },
};
