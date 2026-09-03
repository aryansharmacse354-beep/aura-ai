import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../server';

describe('AuraPredict Authentication & Atmospheric ML Engine Suite', () => {

  describe('PBKDF2 Password Authentication Pipeline', () => {
    it('POST /api/auth/login should authenticate user with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'sarah.lin@aurapredict.org',
          password: 'AuraPredict2026!'
        });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe('sarah.lin@aurapredict.org');
    });

    it('POST /api/auth/register should create new profile with unique password hash and salt', async () => {
      const uniqueEmail = `test_${Date.now()}@aurapredict.org`;
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Dr. Test Scientist',
          email: uniqueEmail,
          password: 'TestPassword2026!',
          role: 'epidemiologist'
        });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe(uniqueEmail);
      expect(res.body.user.passwordHash).toBeUndefined(); // Should not leak hash
    });
  });

  describe('Atmospheric ML Functional Engine Live Pipeline', () => {
    it('POST /api/ml-lab/apply-engine should compute boundary layer and dispersion modulation', async () => {
      const res = await request(app)
        .post('/api/ml-lab/apply-engine')
        .send({
          promptId: 'prompt-8',
          regime: 'ground_inversion',
          currentAQI: 250,
          weather: { boundaryLayerHeightM: 400 }
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.adjustedBoundaryLayerM).toBeLessThan(400); // ground inversion compresses boundary layer
      expect(res.body.dispersionMultiplier).toBeLessThan(1.0);
    });
  });
});
