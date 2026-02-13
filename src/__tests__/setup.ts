// Setup file for tests
// Runs before all tests

// Set test environment
process.env.NODE_ENV = 'test';
process.env.PORT = '4001';
process.env.FRONTEND_URL = 'http://localhost:3000';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/los_inmaduros_test';
process.env.CLERK_SECRET_KEY = 'test_secret_key';
process.env.CLERK_PUBLISHABLE_KEY = 'test_publishable_key';
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_ANON_KEY = 'test_anon_key';

// No need to set jest.setTimeout here, it's configured in jest.config.js