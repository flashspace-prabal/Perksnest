const request = require('supertest');
const express = require('express');

describe('Authentication Endpoints', () => {
  let app;
  let server;
  const baseURL = process.env.BACKEND_URL || 'http://localhost:3000';

  beforeAll(() => {
    app = express();
    app.use(express.json());
  });

  afterAll(() => {
    if (server) server.close();
  });

  // Test data
  const testUser = {
    email: global.testUtils.generateTestEmail(),
    password: 'SecurePassword123!',
    name: 'Test User',
  };

  describe('POST /auth/register', () => {
    it('should register a new user with email and password', async () => {
      const response = await request(baseURL)
        .post('/auth/register')
        .send(testUser)
        .expect('Content-Type', /json/);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body).toHaveProperty('token');
    });

    it('should fail if email already exists', async () => {
      const response = await request(baseURL)
        .post('/auth/register')
        .send(testUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('already exists');
    });

    it('should fail if email is invalid', async () => {
      const response = await request(baseURL)
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          password: 'SecurePassword123!',
          name: 'Test User',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should fail if password is too weak', async () => {
      const response = await request(baseURL)
        .post('/auth/register')
        .send({
          email: global.testUtils.generateTestEmail(),
          password: '123',
          name: 'Test User',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('password');
    });
  });

  describe('POST /auth/login', () => {
    it('should login user with correct credentials', async () => {
      const response = await request(baseURL)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(testUser.email);
    });

    it('should fail with incorrect password', async () => {
      const response = await request(baseURL)
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123!',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should fail with non-existent user', async () => {
      const response = await request(baseURL)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'SomePassword123!',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /auth/google', () => {
    it('should sync or create user with Google OAuth token', async () => {
      const mockGoogleToken = 'google-oauth-token-123';

      const response = await request(baseURL)
        .post('/auth/google')
        .send({
          token: mockGoogleToken,
          referralCode: 'REF123',
        });

      expect([200, 201]).toContain(response.status);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email');
    });

    it('should reject invalid Google token', async () => {
      const response = await request(baseURL)
        .post('/auth/google')
        .send({
          token: 'invalid-token',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /auth/verify-email', () => {
    it('should verify user email with token', async () => {
      const verificationToken = global.testUtils.generateTestToken(testUser.email);

      const response = await request(baseURL)
        .post('/auth/verify-email')
        .send({
          token: verificationToken,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });

    it('should reject invalid verification token', async () => {
      const response = await request(baseURL)
        .post('/auth/verify-email')
        .send({
          token: 'invalid-token',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /auth/refresh', () => {
    it('should refresh JWT token', async () => {
      const oldToken = global.testUtils.generateTestToken('test-user-123');

      const response = await request(baseURL)
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${oldToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout user and invalidate token', async () => {
      const token = global.testUtils.generateTestToken('test-user-123');

      const response = await request(baseURL)
        .post('/auth/logout')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /auth/upgrade-plan', () => {
    it('should upgrade user plan', async () => {
      const token = global.testUtils.generateTestToken('test-user-123');

      const response = await request(baseURL)
        .post('/auth/upgrade-plan')
        .set('Authorization', `Bearer ${token}`)
        .send({
          planId: 'pro',
          paymentMethodId: 'pm_test_123',
        });

      expect([200, 201]).toContain(response.status);
      expect(response.body).toHaveProperty('plan');
    });
  });
});
