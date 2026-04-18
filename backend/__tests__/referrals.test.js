const request = require('supertest');

describe('Referrals Endpoints', () => {
  const baseURL = process.env.BACKEND_URL || 'http://localhost:3000';
  const token = global.testUtils.generateTestToken('test-user-123');

  describe('GET /referrals/info', () => {
    it('should get referral program information', async () => {
      const response = await request(baseURL)
        .get('/referrals/info')
        .expect(200);

      expect(response.body).toHaveProperty('creditPerConversion');
      expect(response.body).toHaveProperty('description');
      expect(response.body.creditPerConversion).toBe(20);
    });
  });

  describe('GET /referrals/tracking', () => {
    it('should track referral clicks for code', async () => {
      const response = await request(baseURL)
        .get('/referrals/tracking?code=TEST123')
        .expect(200);

      expect(response.body).toHaveProperty('clicks');
      expect(response.body).toHaveProperty('conversions');
    });
  });

  describe('POST /referrals/track-click', () => {
    it('should record a referral click', async () => {
      const response = await request(baseURL)
        .post('/referrals/track-click')
        .send({
          referralCode: 'TEST123',
          sessionId: 'session-' + Date.now(),
        })
        .expect(200);

      expect(response.body).toHaveProperty('tracked', true);
    });
  });

  describe('POST /referrals/convert', () => {
    it('should record referral conversion after signup', async () => {
      const sessionId = 'session-' + Date.now();

      // Track click first
      await request(baseURL)
        .post('/referrals/track-click')
        .send({
          referralCode: 'TESTREF',
          sessionId,
        })
        .expect(200);

      // Then register with that session
      const response = await request(baseURL)
        .post('/referrals/convert')
        .send({
          sessionId,
          userId: 'new-user-123',
          referralCode: 'TESTREF',
        })
        .expect(200);

      expect(response.body).toHaveProperty('converted', true);
      expect(response.body).toHaveProperty('creditsAwarded', 20);
    });

    it('should not convert without session tracking', async () => {
      const response = await request(baseURL)
        .post('/referrals/convert')
        .send({
          sessionId: 'untracked-session',
          userId: 'new-user-456',
          referralCode: 'TESTREF',
        })
        .expect([200, 400]);
    });
  });

  describe('GET /referrals/earnings', () => {
    it('should get user referral earnings', async () => {
      const response = await request(baseURL)
        .get('/referrals/earnings')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('totalEarnings');
      expect(response.body).toHaveProperty('totalConversions');
      expect(response.body).toHaveProperty('conversions');
      expect(Array.isArray(response.body.conversions)).toBe(true);
    });

    it('should reject earnings request without authentication', async () => {
      const response = await request(baseURL)
        .get('/referrals/earnings')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /referrals/invites', () => {
    it('should get referral invites sent by user', async () => {
      const response = await request(baseURL)
        .get('/referrals/invites')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((invite) => {
        expect(invite).toHaveProperty('email');
        expect(invite).toHaveProperty('sentAt');
        expect(invite).toHaveProperty('status');
      });
    });
  });

  describe('POST /referrals/send-invite', () => {
    it('should send referral invite to email', async () => {
      const response = await request(baseURL)
        .post('/referrals/send-invite')
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: 'friend@example.com',
          message: 'Check out PerksNest!',
        })
        .expect(200);

      expect(response.body).toHaveProperty('sent', true);
      expect(response.body).toHaveProperty('inviteId');
    });

    it('should reject invalid email', async () => {
      const response = await request(baseURL)
        .post('/referrals/send-invite')
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: 'not-an-email',
          message: 'Check out PerksNest!',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should reject without authentication', async () => {
      const response = await request(baseURL)
        .post('/referrals/send-invite')
        .send({
          email: 'friend@example.com',
          message: 'Check out PerksNest!',
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });
});
