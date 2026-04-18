const request = require('supertest');

describe('Deals Endpoints', () => {
  const baseURL = process.env.BACKEND_URL || 'http://localhost:3000';
  const token = global.testUtils.generateTestToken('test-user-123');

  describe('GET /deals', () => {
    it('should return list of all deals', async () => {
      const response = await request(baseURL)
        .get('/deals')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0]).toHaveProperty('name');
        expect(response.body[0]).toHaveProperty('category');
        expect(response.body[0]).toHaveProperty('dealText');
      }
    });

    it('should filter deals by category', async () => {
      const response = await request(baseURL)
        .get('/deals?category=ai')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((deal) => {
        expect(deal.category).toBe('ai');
      });
    });

    it('should search deals by name', async () => {
      const response = await request(baseURL)
        .get('/deals?search=OpenAI')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((deal) => {
        expect(deal.name.toLowerCase()).toContain('openai');
      });
    });

    it('should paginate deals', async () => {
      const response = await request(baseURL)
        .get('/deals?page=1&limit=10')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(10);
    });

    it('should sort deals by various criteria', async () => {
      const response1 = await request(baseURL)
        .get('/deals?sort=popular')
        .expect(200);

      const response2 = await request(baseURL)
        .get('/deals?sort=newest')
        .expect(200);

      expect(Array.isArray(response1.body)).toBe(true);
      expect(Array.isArray(response2.body)).toBe(true);
    });
  });

  describe('GET /deals/:id', () => {
    it('should return deal details by ID', async () => {
      // First get a deal ID
      const dealsResponse = await request(baseURL)
        .get('/deals')
        .expect(200);

      if (dealsResponse.body.length > 0) {
        const dealId = dealsResponse.body[0].id;

        const response = await request(baseURL)
          .get(`/deals/${dealId}`)
          .expect(200);

        expect(response.body).toHaveProperty('id', dealId);
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('description');
        expect(response.body).toHaveProperty('reviews');
      }
    });

    it('should return 404 for non-existent deal', async () => {
      const response = await request(baseURL)
        .get('/deals/non-existent-id')
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /deals/claim', () => {
    it('should claim a deal for authenticated user', async () => {
      const dealsResponse = await request(baseURL)
        .get('/deals')
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

    it('should reject claim without authentication', async () => {
      const response = await request(baseURL)
        .post('/deals/claim')
        .send({ dealId: 'deal-123' })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should prevent duplicate claims', async () => {
      const dealsResponse = await request(baseURL)
        .get('/deals')
        .expect(200);

      if (dealsResponse.body.length > 0) {
        const dealId = dealsResponse.body[0].id;

        // First claim
        await request(baseURL)
          .post('/deals/claim')
          .set('Authorization', `Bearer ${token}`)
          .send({ dealId })
          .expect(201);

        // Second claim (should fail or return existing)
        const response = await request(baseURL)
          .post('/deals/claim')
          .set('Authorization', `Bearer ${token}`)
          .send({ dealId });

        expect([200, 400, 409]).toContain(response.status);
      }
    });
  });

  describe('GET /deals/reviews/:dealId', () => {
    it('should return reviews for a deal', async () => {
      const dealsResponse = await request(baseURL)
        .get('/deals')
        .expect(200);

      if (dealsResponse.body.length > 0) {
        const dealId = dealsResponse.body[0].id;

        const response = await request(baseURL)
          .get(`/deals/reviews/${dealId}`)
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        response.body.forEach((review) => {
          expect(review).toHaveProperty('author');
          expect(review).toHaveProperty('rating');
          expect(review).toHaveProperty('text');
        });
      }
    });
  });

  describe('POST /deals/review', () => {
    it('should submit a review for a claimed deal', async () => {
      const dealsResponse = await request(baseURL)
        .get('/deals')
        .expect(200);

      if (dealsResponse.body.length > 0) {
        const dealId = dealsResponse.body[0].id;

        const response = await request(baseURL)
          .post('/deals/review')
          .set('Authorization', `Bearer ${token}`)
          .send({
            dealId,
            rating: 5,
            text: 'Great deal!',
          })
          .expect(201);

        expect(response.body).toHaveProperty('reviewId');
        expect(response.body).toHaveProperty('rating', 5);
      }
    });

    it('should reject review without authentication', async () => {
      const response = await request(baseURL)
        .post('/deals/review')
        .send({
          dealId: 'deal-123',
          rating: 5,
          text: 'Great deal!',
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });
});
