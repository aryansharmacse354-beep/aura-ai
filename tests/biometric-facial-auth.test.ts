import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../server';
import { 
  analyzeFacialFrame, 
  computeCosineSimilarity, 
  generateFacialEmbedding,
  normalizeL2
} from '../server/services/openCvAgentService';
import { BiometricAuthService } from '../src/services/biometricAuthService';

describe('Biometric & OpenCV Facial Authentication System', () => {

  describe('OpenCV Agent Computer Vision & Liveness Pipeline', () => {
    it('should extract 512-dimensional normalized facial embedding vector', () => {
      const buffer = Buffer.from('test_frame_face_image_sample');
      const embedding = generateFacialEmbedding(buffer, 'test@aurapredict.org');

      expect(embedding).toHaveLength(512);
      
      // Verify unit norm (L2 norm ≈ 1.0)
      const norm = Math.sqrt(embedding.reduce((sum, v) => sum + v * v, 0));
      expect(norm).toBeCloseTo(1.0, 4);
    });

    it('should compute accurate cosine similarity between identical and disparate embeddings', () => {
      const vecA = normalizeL2([0.5, 0.5, 0.5, 0.5]);
      const vecB = normalizeL2([0.5, 0.5, 0.5, 0.5]);
      const vecC = normalizeL2([-0.5, -0.5, -0.5, -0.5]);

      const simIdentity = computeCosineSimilarity(vecA, vecB);
      expect(simIdentity).toBeCloseTo(1.0, 4);

      const simOpposite = computeCosineSimilarity(vecA, vecC);
      expect(simOpposite).toBeCloseTo(-1.0, 4);
    });

    it('should process optical frame, extract 68-pt landmarks and evaluate anti-spoofing liveness', async () => {
      const sampleBase64 = 'data:image/jpeg;base64,' + Buffer.from('simulated_face_optical_matrix_1234567890').toString('base64');
      const analysis = await analyzeFacialFrame(sampleBase64, 'sarah.lin@aurapredict.org');

      expect(analysis.faceDetected).toBe(true);
      expect(analysis.confidence).toBeGreaterThan(0.85);
      expect(analysis.landmarks.leftEye).toBeDefined();
      expect(analysis.landmarks.rightEye).toBeDefined();
      expect(analysis.landmarks.noseTip).toBeDefined();
      expect(analysis.liveness.passed).toBe(true);
      expect(analysis.liveness.livenessScore).toBeGreaterThan(0.75);
      expect(analysis.embeddingVector).toHaveLength(512);
      expect(analysis.agentThoughtChain.length).toBeGreaterThan(0);
    });
  });

  describe('Android BiometricPrompt & WebAuthn Integration Endpoints', () => {
    let challengeId: string;

    it('POST /api/auth/biometric/challenge should issue cryptographic nonce', async () => {
      const res = await request(app)
        .post('/api/auth/biometric/challenge')
        .send({ userId: 'usr_test_123' });

      expect(res.status).toBe(200);
      expect(res.body.challengeId).toBeDefined();
      expect(res.body.challenge).toBeDefined();
      challengeId = res.body.challengeId;
    });

    it('POST /api/auth/biometric/verify should authenticate user via biometric assertion', async () => {
      const res = await request(app)
        .post('/api/auth/biometric/verify')
        .send({
          email: 'sarah.lin@aurapredict.org',
          challengeId,
          credentialId: 'cred_android_bio_123',
          clientDataJSON: Buffer.from('{"challenge":"test"}').toString('base64'),
          signature: Buffer.from('sig_test').toString('base64')
        });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.authMethod).toBe('biometric');
      expect(res.body.user.email).toBe('sarah.lin@aurapredict.org');
    });

    it('POST /api/auth/facial/verify should authenticate user via OpenCV Agent facial scan', async () => {
      const sampleBase64 = 'data:image/jpeg;base64,' + Buffer.from('face_stream_test_buffer_data_token').toString('base64');

      const res = await request(app)
        .post('/api/auth/facial/verify')
        .send({
          imageBase64: sampleBase64,
          userEmail: 'sarah.lin@aurapredict.org'
        });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.authMethod).toBe('facial_opencv');
      expect(res.body.matchConfidence).toBeGreaterThan(65);
      expect(res.body.detection.faceDetected).toBe(true);
    });
  });

  describe('Atmospheric ML Functional Engine Live Pipeline', () => {
    it('POST /api/ml-lab/run-prompt should execute mathematical PINN derivation', async () => {
      const res = await request(app)
        .post('/api/ml-lab/run-prompt')
        .send({
          promptId: 'prompt-1',
          promptNumber: 1,
          promptTitle: 'Physics-Informed Neural Network (PINN) Loss Formulation',
          promptTemplate: 'Derive 2D Navier-Stokes advection-diffusion equation',
          cityContext: { cityName: 'Delhi NCR', aqi: 310, pblh: 280 }
        });

      expect(res.status).toBe(200);
      expect(res.body.output).toBeDefined();
      expect(res.body.output.length).toBeGreaterThan(20);
    }, 35000);

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
