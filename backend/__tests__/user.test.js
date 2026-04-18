const request = require('supertest');

describe('User Endpoints', () => {
  const baseURL = process.env.BACKEND_URL || 'http://localhost:3000';
  const token = global.testUtils.generateTestToken('test-user-123');
  const userId = 'test-user-123';

  describe('GET /user/profile', () => {
    it('should get authenticated user profile', async () => {
      const response = await request(baseURL)
        .get('/user/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', userId);
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('createdAt');
    });

    it('should reject request without authentication', async () => {
      const response = await request(baseURL)
        .get('/user/profile')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /user/profile', () => {
    it('should update user profile', async () => {
      const response = await request(baseURL)
        .put('/user/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated Name',
          bio: 'My bio',
        })
        .expect(200);

      expect(response.body).toHaveProperty('name', 'Updated Name');
      expect(response.body).toHaveProperty('bio', 'My bio');
    });

    it('should reject profile update without authentication', async () => {
      const response = await request(baseURL)
        .put('/user/profile')
        .send({
          name: 'Updated Name',
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /user/claims', () => {
    it('should get user claimed deals', async () => {
      const response = await request(baseURL)
        .get('/user/claims')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((claim) => {
        expect(claim).toHaveProperty('dealId');
        expect(claim).toHaveProperty('claimDate');
        expect(claim).toHaveProperty('status');
      });
    });

    it('should reject claims request without authentication', async () => {
      const response = await request(baseURL)
        .get('/user/claims')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /user/bookmarks', () => {
    it('should bookmark a deal', async () => {
      const dealsResponse = await request(baseURL)
        .get('/deals')
        .expect(200);

      if (dealsResponse.body.length > 0) {
        const dealId = dealsResponse.body[0].id;

        const response = await request(baseURL)
          .post('/user/bookmarks')
          .set('Authorization', `Bearer ${token}`)
          .send({ dealId })
          .expect(201);

        expect(response.body).toHaveProperty('bookmarkId');
        expect(response.body).toHaveProperty('dealId', dealId);
      }
    });

    it('should reject bookmark without authentication', async () => {
      const response = await request(baseURL)
        .post('/user/bookmarks')
        .send({ dealId: 'deal-123' })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /user/bookmarks', () => {
    it('should get user bookmarked deals', async () => {
      const response = await request(baseURL)
        .get('/user/bookmarks')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((bookmark) => {
        expect(bookmark).toHaveProperty('dealId');
        expect(bookmark).toHaveProperty('name');
        expect(bookmark).toHaveProperty('category');
      });
    });
  });

  describe('DELETE /user/bookmarks/:dealId', () => {
    it('should remove bookmark', async () => {
      const dealsResponse = await request(baseURL)
        .get('/deals')
        .expect(200);

      if (dealsResponse.body.length > 0) {
        const dealId = dealsResponse.body[0].id;

        // First bookmark it
        await request(baseURL)
          .post('/user/bookmarks')
          .set('Authorization', `Bearer ${token}`)
          .send({ dealId })
          .expect(201);

        // Then remove it
        const response = await request(baseURL)
          .delete(`/user/bookmarks/${dealId}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200);

        expect(response.body).toHaveProperty('message');
      }
    });
  });

  describe('GET /user/referrals', () => {
    it('should get user referral code and stats', async () => {
      const response = await request(baseURL)
        .get('/user/referrals')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('referralCode');
      expect(response.body).toHaveProperty('totalClicks');
      expect(response.body).toHaveProperty('totalConversions');
      expect(response.body).toHaveProperty('totalEarnings');
    });
  });

  describe('POST /user/password-reset', () => {
    it('should request password reset', async () => {
      const response = await request(baseURL)
        .post('/user/password-reset')
        .send({
          email: 'test@example.com',
        })
        .expect(200);

      expect(response.body).toHaveProperty('message');
    });

    it('should handle non-existent email gracefully', async () => {
      const response = await request(baseURL)
        .post('/user/password-reset')
        .send({
          email: 'nonexistent@example.com',
        })
        .expect(200);

      expect(response.body).toHaveProperty('message');
    });
  });
});
