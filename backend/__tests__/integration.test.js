const request = require('supertest');

describe('End-to-End Workflows', () => {
  const baseURL = process.env.BACKEND_URL || 'http://localhost:3000';

  describe('Complete User Onboarding & Deal Claiming Workflow', () => {
    let userId;
    let token;
    let referralCode;

    it('Step 1: User registers with referral code', async () => {
      const testEmail = global.testUtils.generateTestEmail();

      const response = await request(baseURL)
        .post('/auth/register')
        .send({
          email: testEmail,
          password: 'SecurePassword123!',
          name: 'Test User',
          referralCode: 'REFERRER123',
        })
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(testEmail);

      userId = response.body.user.id;
      token = response.body.token;
    });

    it('Step 2: User gets referral code', async () => {
      const response = await request(baseURL)
        .get('/user/referrals')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('referralCode');
      referralCode = response.body.referralCode;
    });

    it('Step 3: User verifies email', async () => {
      // In real scenario, email would be sent
      const verificationToken = global.testUtils.generateTestToken(userId);

      const response = await request(baseURL)
        .post('/auth/verify-email')
        .send({
          token: verificationToken,
        })
        .expect(200);

      expect(response.body).toHaveProperty('message');
    });

    it('Step 4: User browses deals by category', async () => {
      const response = await request(baseURL)
        .get('/deals?category=ai&limit=10')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('Step 5: User views deal details', async () => {
      const dealsResponse = await request(baseURL)
        .get('/deals?category=ai')
        .expect(200);

      if (dealsResponse.body.length > 0) {
        const dealId = dealsResponse.body[0].id;

        const response = await request(baseURL)
          .get(`/deals/${dealId}`)
          .expect(200);

        expect(response.body).toHaveProperty('id', dealId);
        expect(response.body).toHaveProperty('reviews');
      }
    });

    it('Step 6: User claims deal', async () => {
      const dealsResponse = await request(baseURL)
        .get('/deals?category=ai')
        .expect(200);

      if (dealsResponse.body.length > 0) {
        const dealId = dealsResponse.body[0].id;

        const response = await request(baseURL)
          .post('/deals/claim')
          .set('Authorization', `Bearer ${token}`)
          .send({ dealId })
          .expect(201);

        expect(response.body).toHaveProperty('claimId');
        expect(response.body).toHaveProperty('dealId', dealId);
      }
    });

    it('Step 7: User bookmarks another deal', async () => {
      const dealsResponse = await request(baseURL)
        .get('/deals?category=finance')
        .expect(200);

      if (dealsResponse.body.length > 0) {
        const dealId = dealsResponse.body[0].id;

        const response = await request(baseURL)
          .post('/user/bookmarks')
          .set('Authorization', `Bearer ${token}`)
          .send({ dealId })
          .expect(201);

        expect(response.body).toHaveProperty('bookmarkId');
      }
    });

    it('Step 8: User reviews claimed deal', async () => {
      const claimsResponse = await request(baseURL)
        .get('/user/claims')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      if (claimsResponse.body.length > 0) {
        const dealId = claimsResponse.body[0].dealId;

        const response = await request(baseURL)
          .post('/deals/review')
          .set('Authorization', `Bearer ${token}`)
          .send({
            dealId,
            rating: 4,
            text: 'Great platform!',
          })
          .expect(201);

        expect(response.body).toHaveProperty('reviewId');
      }
    });

    it('Step 9: User invites friend via referral', async () => {
      const response = await request(baseURL)
        .post('/referrals/send-invite')
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: global.testUtils.generateTestEmail(),
          message: 'Join PerksNest and get exclusive deals!',
        })
        .expect(200);

      expect(response.body).toHaveProperty('sent', true);
    });

    it('Step 10: User views dashboard stats', async () => {
      const claimsResponse = await request(baseURL)
        .get('/user/claims')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const bookmarksResponse = await request(baseURL)
        .get('/user/bookmarks')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const referralsResponse = await request(baseURL)
        .get('/referrals/earnings')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(claimsResponse.body)).toBe(true);
      expect(Array.isArray(bookmarksResponse.body)).toBe(true);
      expect(referralsResponse.body).toHaveProperty('totalEarnings');
    });
  });

  describe('Google OAuth Login Workflow', () => {
    let googleUser;
    let token;

    it('Step 1: New user logs in with Google', async () => {
      const mockGoogleToken = 'google-oauth-token-' + Date.now();

      const response = await request(baseURL)
        .post('/auth/google')
        .send({
          token: mockGoogleToken,
          referralCode: 'REF123',
        })
        .expect([200, 201]);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email');

      googleUser = response.body.user;
      token = response.body.token;
    });

    it('Step 2: Google user accesses profile', async () => {
      const response = await request(baseURL)
        .get('/user/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.id).toBe(googleUser.id);
      expect(response.body.email).toBe(googleUser.email);
    });

    it('Step 3: Google user browses and claims deals', async () => {
      const dealsResponse = await request(baseURL)
        .get('/deals?limit=5')
        .expect(200);

      if (dealsResponse.body.length > 0) {
        const dealId = dealsResponse.body[0].id;

        const claimResponse = await request(baseURL)
          .post('/deals/claim')
          .set('Authorization', `Bearer ${token}`)
          .send({ dealId })
          .expect(201);

        expect(claimResponse.body).toHaveProperty('claimId');
      }
    });

    it('Step 4: Existing Google user logs in again', async () => {
      const mockGoogleToken = 'google-oauth-token-' + Date.now();

      const response = await request(baseURL)
        .post('/auth/google')
        .send({
          token: mockGoogleToken,
        })
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
    });
  });

  describe('Search & Filter Workflow', () => {
    it('User searches for specific deals', async () => {
      const response = await request(baseURL)
        .get('/deals?search=AI&category=ai')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('User filters by multiple criteria', async () => {
      const response = await request(baseURL)
        .get('/deals?category=finance&sort=popular&limit=20')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('User paginates through results', async () => {
      const page1 = await request(baseURL)
        .get('/deals?page=1&limit=10')
        .expect(200);

      const page2 = await request(baseURL)
        .get('/deals?page=2&limit=10')
        .expect(200);

      expect(Array.isArray(page1.body)).toBe(true);
      expect(Array.isArray(page2.body)).toBe(true);
    });
  });

  describe('Support Ticket Workflow', () => {
    const token = global.testUtils.generateTestToken('test-user-123');

    it('User creates support ticket', async () => {
      const response = await request(baseURL)
        .post('/support/tickets')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Issue with deal claim',
          message: 'I cannot claim a deal',
          category: 'technical',
        })
        .expect(201);

      expect(response.body).toHaveProperty('ticketId');
      expect(response.body).toHaveProperty('status', 'open');
    });

    it('User replies to ticket', async () => {
      // First create a ticket
      const ticketResponse = await request(baseURL)
        .post('/support/tickets')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test ticket',
          message: 'Test message',
          category: 'general',
        })
        .expect(201);

      const ticketId = ticketResponse.body.ticketId;

      // Then add reply
      const response = await request(baseURL)
        .post(`/support/tickets/${ticketId}/replies`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          message: 'More details about my issue',
        })
        .expect(201);

      expect(response.body).toHaveProperty('messageId');
    });
  });
});
