import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../server';

describe('AuraPredict Express API Endpoints & Supertest Integration', () => {
  let authToken = '';

  it('GET /api/health should return 200 and operational health metadata', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'healthy');
    expect(res.body).toHaveProperty('uptimeSeconds');
    expect(res.body).toHaveProperty('storageStatus', 'connected');
    expect(res.body).toHaveProperty('version');
  });

  it('GET /api/metrics should return cluster metrics and data store counts', async () => {
    const res = await request(app).get('/api/metrics');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('activeUsersCount');
    expect(res.body).toHaveProperty('auditLogsCount');
    expect(res.body).toHaveProperty('savedSimulationsCount');
    expect(res.body).toHaveProperty('memoryUsageMB');
  });

  it('POST /api/auth/register should create a new user profile with hashed credentials', async () => {
    const uniqueEmail = `integration.tester.${Date.now()}@aurapredict.ai`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Dr. Integration Tester',
        email: uniqueEmail,
        password: 'AuraSecurePass123!',
        role: 'policymaker',
        healthConditions: ['hypertension'],
        alertThresholdAQI: 130
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.email).toBe(uniqueEmail);
    expect(res.body.user.role).toBe('policymaker');
    // Ensure sensitive security fields are never leaked to the client
    expect(res.body.user.passwordHash).toBeUndefined();
    expect(res.body.user.salt).toBeUndefined();

    authToken = res.body.token;
  });

  it('POST /api/auth/login should authenticate valid users and return session JWT', async () => {
    // Login with the primary default seed account
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'sarah.lin@aurapredict.org',
        password: 'AuraPredict2026!'
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('sarah.lin@aurapredict.org');
    expect(res.body.user.passwordHash).toBeUndefined();
  });

  it('POST /api/auth/login should return 401 on incorrect credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'sarah.lin@aurapredict.org',
        password: 'WrongPassword999!'
      });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('GET /api/auth/me should return the authenticated user profile with Bearer token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body).toHaveProperty('auditLogs');
    expect(Array.isArray(res.body.auditLogs)).toBe(true);
  });

  it('POST /api/predict/forecast should return forecast telemetry and generative report', async () => {
    const res = await request(app)
      .post('/api/predict/forecast')
      .send({
        cityName: 'Delhi NCR',
        currentAQI: 285,
        windSpeed: '12 km/h',
        dominantPollutant: 'PM2.5',
        scenario: 'stubble_burning_surge'
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('cityName', 'Delhi NCR');
    expect(res.body).toHaveProperty('summaryMarkdown');
    expect(res.body).toHaveProperty('modelUsed');
    expect(typeof res.body.summaryMarkdown).toBe('string');
  }, 20000);

  it('POST /api/policy/simulate should compute environmental interventions and impact metrics', async () => {
    const res = await request(app)
      .post('/api/policy/simulate')
      .send({
        scenarioTitle: 'Targeted EV & Industrial Scrubbing',
        interventions: [
          { id: 'transport_ev', name: 'EV Transition', intensity: 70 },
          { id: 'industrial_scrubbers', name: 'Heavy Scrubbers', intensity: 80 }
        ]
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('scenarioName');
    expect(res.body).toHaveProperty('projectedAQIReductionPercent');
    expect(res.body).toHaveProperty('newAvgAQI');
    expect(res.body.projectedAQIReductionPercent).toBeGreaterThan(0);
  }, 30000);

  it('POST /api/gemini/fast-analyze should return ultra-low latency triage guidance', async () => {
    const res = await request(app)
      .post('/api/gemini/fast-analyze')
      .send({
        metric: 'PM2.5',
        value: 240,
        location: 'Anand Vihar, Delhi'
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('analysis');
    expect(res.body).toHaveProperty('modelUsed');
  }, 15000);

  it('POST /api/routes/save and GET /api/routes should persist clean air transit routes', async () => {
    const routePayload = {
      name: 'Safe School Commute',
      origin: 'Dwarka Sector 10',
      destination: 'Connaught Place',
      distanceKm: 18.2,
      exposureReductionPct: 42,
      waypoints: [
        { lat: 28.5921, lng: 77.0460, aqi: 110 },
        { lat: 28.6315, lng: 77.2167, aqi: 95 }
      ]
    };

    const saveRes = await request(app)
      .post('/api/routes/save')
      .set('Authorization', `Bearer ${authToken}`)
      .send(routePayload);

    expect(saveRes.status).toBe(200);
    expect(saveRes.body).toHaveProperty('savedRoute');
    expect(saveRes.body.savedRoute.name).toBe('Safe School Commute');

    const getRes = await request(app)
      .get('/api/routes')
      .set('Authorization', `Bearer ${authToken}`);

    expect(getRes.status).toBe(200);
    expect(getRes.body).toHaveProperty('routes');
    expect(getRes.body.routes.some((r: any) => r.name === 'Safe School Commute')).toBe(true);
  });
});
