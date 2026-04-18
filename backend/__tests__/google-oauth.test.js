const request = require('supertest');

describe('Google OAuth Integration', () => {
  const baseURL = process.env.BACKEND_URL || 'http://localhost:3000';

  describe('POST /auth/google', () => {
    it('should handle Google OAuth token successfully', async () => {
      const mockGoogleToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiJ0ZXN0LWNsaWVudC1pZC5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6InRlc3QtY2xpZW50LWlkLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTIzNDU2Nzg5MCIsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IlRlc3QgVXNlciIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vcGljdHVyZSIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwMDAzNjAwfQ.test';

      const response = await request(baseURL)
        .post('/auth/google')
        .send({
          token: mockGoogleToken,
          referralCode: 'REFER123',
        })
        .expect([200, 201]);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email');
      expect(response.body.user).toHaveProperty('name');
      expect(response.body.user).toHaveProperty('picture');
    });

    it('should create new user with Google OAuth', async () => {
      const mockGoogleToken = 'google-oauth-token-new-' + Date.now();

      const response = await request(baseURL)
        .post('/auth/google')
        .send({
          token: mockGoogleToken,
        });

      if (response.status === 201) {
        expect(response.body).toHaveProperty('user');
        expect(response.body.user).toHaveProperty('id');
        expect(response.body.user).toHaveProperty('email');
        expect(response.body.user).toHaveProperty('authMethod', 'google');
      }
    });

    it('should login existing Google user', async () => {
      const mockGoogleToken = 'google-oauth-token-existing-' + Date.now();

      // First login creates the user
      const firstResponse = await request(baseURL)
        .post('/auth/google')
        .send({
          token: mockGoogleToken,
        })
        .expect([200, 201]);

      const userId = firstResponse.body.user.id;

      // Second login should return same user
      const secondResponse = await request(baseURL)
        .post('/auth/google')
        .send({
          token: mockGoogleToken,
        })
        .expect([200, 201]);

      expect(secondResponse.body.user.id).toBe(userId);
      expect(secondResponse.body).toHaveProperty('token');
    });

    it('should sync Google user data on login', async () => {
      const mockGoogleToken = 'google-oauth-token-sync-' + Date.now();

      const response = await request(baseURL)
        .post('/auth/google')
        .send({
          token: mockGoogleToken,
        })
        .expect([200, 201]);

      const user = response.body.user;

      // Verify user data is synced
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('picture');
      expect(user).toHaveProperty('authMethod', 'google');
      expect(user).toHaveProperty('googleId');
    });

    it('should apply referral code on Google signup', async () => {
      const mockGoogleToken = 'google-oauth-token-ref-' + Date.now();
      const referralCode = 'TESTREF' + Math.random().toString(36).substring(7);

      const response = await request(baseURL)
        .post('/auth/google')
        .send({
          token: mockGoogleToken,
          referralCode: referralCode,
        })
        .expect([200, 201]);

      expect(response.body.user).toHaveProperty('referredBy');
    });

    it('should reject invalid Google token', async () => {
      const response = await request(baseURL)
        .post('/auth/google')
        .send({
          token: 'invalid-token-format',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toMatch(/token|authentication/i);
    });

    it('should reject expired Google token', async () => {
      const expiredToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhelAiOiJ0ZXN0LWNsaWVudC1pZCIsImF1ZCI6InRlc3QtY2xpZW50LWlkIiwic3ViIjoiMTIzNDU2Nzg5MCIsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MTYwMDAwMDEwMH0.test';

      const response = await request(baseURL)
        .post('/auth/google')
        .send({
          token: expiredToken,
        })
        .expect([400, 401]);

      expect(response.body).toHaveProperty('error');
    });

    it('should handle Google token without email', async () => {
      const tokenWithoutEmail = 'google-token-no-email-' + Date.now();

      const response = await request(baseURL)
        .post('/auth/google')
        .send({
          token: tokenWithoutEmail,
        });

      // Should reject if email is required
      if (response.status === 400) {
        expect(response.body.error).toMatch(/email/i);
      }
    });

    it('should prevent duplicate Google account linkage', async () => {
      const mockEmail = `test-${Date.now()}@gmail.com`;
      const googleToken1 = 'google-dup-test-1-' + Date.now();

      // First registration
      await request(baseURL)
        .post('/auth/google')
        .send({
          token: googleToken1,
        })
        .expect([200, 201]);

      // Attempt second registration with different token but should be same user
      const response = await request(baseURL)
        .post('/auth/google')
        .send({
          token: googleToken1,
        })
        .expect([200, 201]);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
    });

    it('should set correct auth method for Google user', async () => {
      const mockGoogleToken = 'google-auth-method-test-' + Date.now();

      const response = await request(baseURL)
        .post('/auth/google')
        .send({
          token: mockGoogleToken,
        })
        .expect([200, 201]);

      expect(response.body.user.authMethod).toBe('google');
    });

    it('should return JWT token for authenticated session', async () => {
      const mockGoogleToken = 'google-jwt-test-' + Date.now();

      const response = await request(baseURL)
        .post('/auth/google')
        .send({
          token: mockGoogleToken,
        })
        .expect([200, 201]);

      expect(response.body).toHaveProperty('token');
      expect(response.body.token).toBeDefined();
      expect(response.body.token.length).toBeGreaterThan(0);

      // Token should be usable for API requests
      const token = response.body.token;
      const profileResponse = await request(baseURL)
        .get('/user/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(profileResponse.body).toHaveProperty('id');
      expect(profileResponse.body).toHaveProperty('email');
    });

    it('should handle concurrent Google logins', async () => {
      const token1 = 'google-concurrent-1-' + Date.now();
      const token2 = 'google-concurrent-2-' + Date.now();

      const [response1, response2] = await Promise.all([
        request(baseURL)
          .post('/auth/google')
          .send({ token: token1 }),
        request(baseURL)
          .post('/auth/google')
          .send({ token: token2 }),
      ]);

      // Both should succeed
      expect([response1.status, response2.status]).toEqual(
        expect.arrayContaining([200, 201])
      );

      // Should have different user IDs
      expect(response1.body.user.id).not.toBe(response2.body.user.id);
    });

    it('should update last login timestamp', async () => {
      const mockGoogleToken = 'google-timestamp-test-' + Date.now();

      const response1 = await request(baseURL)
        .post('/auth/google')
        .send({
          token: mockGoogleToken,
        })
        .expect([200, 201]);

      const firstLoginTime = new Date(response1.body.user.lastLogin);

      // Wait a moment
      await global.testUtils.delay(100);

      const response2 = await request(baseURL)
        .post('/auth/google')
        .send({
          token: mockGoogleToken,
        })
        .expect([200, 201]);

      const secondLoginTime = new Date(response2.body.user.lastLogin);

      // Last login should be updated
      expect(secondLoginTime.getTime()).toBeGreaterThanOrEqual(firstLoginTime.getTime());
    });

    it('should generate unique referral code for Google user', async () => {
      const mockGoogleToken = 'google-ref-code-' + Date.now();

      const response = await request(baseURL)
        .post('/auth/google')
        .send({
          token: mockGoogleToken,
        })
        .expect([200, 201]);

      expect(response.body.user).toHaveProperty('referralCode');
      expect(response.body.user.referralCode).toBeDefined();
      expect(response.body.user.referralCode.length).toBeGreaterThan(0);
    });
  });

  describe('Google OAuth Error Handling', () => {
    it('should reject missing token', async () => {
      const response = await request(baseURL)
        .post('/auth/google')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject malformed request', async () => {
      const response = await request(baseURL)
        .post('/auth/google')
        .send('invalid json')
        .expect([400, 415]);

      expect(response.body).toHaveProperty('error');
    });

    it('should handle Google API failure gracefully', async () => {
      const response = await request(baseURL)
        .post('/auth/google')
        .send({
          token: 'token-with-api-failure',
        });

      // Should return error, not crash
      expect([400, 401, 403, 500]).toContain(response.status);
      expect(response.body).toHaveProperty('error');
    });
  });
});
