import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../server';

describe('OpenAPI 3.0 Documentation & Swagger UI Endpoints', () => {
  it('GET /api/openapi.json should return valid OpenAPI 3.0 specification', async () => {
    const res = await request(app).get('/api/openapi.json');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('openapi', '3.0.3');
    expect(res.body).toHaveProperty('info');
    expect(res.body.info.title).toContain('AuraPredict AI');
    expect(res.body).toHaveProperty('paths');
    expect(res.body.paths).toHaveProperty('/api/health');
    expect(res.body.paths).toHaveProperty('/api/predict/forecast');
    expect(res.body.paths).toHaveProperty('/api/auth/login');
  });

  it('GET /api/docs should return interactive Swagger UI HTML page', async () => {
    const res = await request(app).get('/api/docs');
    expect(res.status).toBe(200);
    expect(res.text).toContain('<!DOCTYPE html>');
    expect(res.text).toContain('SwaggerUIBundle');
    expect(res.text).toContain('/api/openapi.json');
  });
});
