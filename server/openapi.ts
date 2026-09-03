export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'AuraPredict AI — Atmospheric Intelligence & Proactive Mitigation Platform API',
    version: '1.0.0',
    description: 'Enterprise REST API powering spatio-temporal physics-informed neural network forecasting (PINN), Graph Neural Network (GNN) dispersion, multi-agent climate consensus, Gemini 3.7 Pro multi-turn reasoning, and low-exposure transit routing.',
    contact: {
      name: 'AuraPredict AI Atmospheric Research Group',
      email: 'aryansharmacse354@gmail.com',
      url: 'https://aurapredict.ai'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: '/',
      description: 'Primary AuraPredict AI Microservice Node'
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'PBKDF2 session token or signed JWT returned by /api/auth/login'
      }
    },
    schemas: {
      HealthResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'healthy' },
          uptimeSeconds: { type: 'number', example: 1420 },
          timestamp: { type: 'string', format: 'date-time' },
          version: { type: 'string', example: '1.0.0' },
          geminiConfigured: { type: 'boolean', example: true },
          storageStatus: { type: 'string', example: 'connected' }
        }
      },
      MetricsResponse: {
        type: 'object',
        properties: {
          activeUsersCount: { type: 'number', example: 6 },
          auditLogsCount: { type: 'number', example: 48 },
          savedSimulationsCount: { type: 'number', example: 12 },
          savedRoutesCount: { type: 'number', example: 5 },
          memoryUsageMB: { type: 'number', example: 124 },
          timestamp: { type: 'string', format: 'date-time' }
        }
      },
      UserAccount: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'usr_001' },
          name: { type: 'string', example: 'Dr. Sarah Lin' },
          email: { type: 'string', format: 'email', example: 'sarah.lin@aurapredict.org' },
          role: { type: 'string', enum: ['citizen', 'researcher', 'policymaker', 'health_official', 'industrial_operator'], example: 'researcher' },
          avatar: { type: 'string' },
          healthConditions: { type: 'array', items: { type: 'string' }, example: ['asthma'] },
          alertThresholdAQI: { type: 'number', example: 150 }
        }
      },
      ForecastRequest: {
        type: 'object',
        required: ['cityName', 'currentAQI'],
        properties: {
          cityName: { type: 'string', example: 'Delhi NCR' },
          currentAQI: { type: 'number', example: 285 },
          windSpeed: { type: 'string', example: '12 km/h' },
          dominantPollutant: { type: 'string', example: 'PM2.5' },
          scenario: { type: 'string', example: 'stubble_burning_surge' }
        }
      },
      PolicySimulationRequest: {
        type: 'object',
        required: ['scenarioTitle', 'interventions'],
        properties: {
          scenarioTitle: { type: 'string', example: 'Targeted EV & Industrial Scrubbing' },
          cityId: { type: 'string', example: 'delhi' },
          cityName: { type: 'string', example: 'Delhi NCR' },
          interventions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'transport_ev' },
                name: { type: 'string', example: 'EV Transition' },
                intensity: { type: 'number', example: 70 }
              }
            }
          }
        }
      }
    }
  },
  paths: {
    '/api/health': {
      get: {
        summary: 'Operational Health Probe',
        description: 'Returns microservice health telemetry, storage persistence connectivity, and Gemini API configuration state.',
        responses: {
          '200': {
            description: 'System operational',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HealthResponse' }
              }
            }
          }
        }
      }
    },
    '/api/metrics': {
      get: {
        summary: 'Cluster Observability & Telemetry Metrics',
        description: 'Returns Prometheus-compatible resource utilization, heap memory usage, active sessions, and data store counts.',
        responses: {
          '200': {
            description: 'Operational metrics payload',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/MetricsResponse' }
              }
            }
          }
        }
      }
    },
    '/api/auth/login': {
      post: {
        summary: 'User Authentication & Session Initialization',
        description: 'Validates user credentials against PBKDF2 salted hashes and creates an active Bearer session token.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'sarah.lin@aurapredict.org' },
                  password: { type: 'string', format: 'password', example: 'AuraPredict2026!' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Authentication successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: { type: 'string' },
                    user: { $ref: '#/components/schemas/UserAccount' }
                  }
                }
              }
            }
          },
          '401': {
            description: 'Invalid credentials or account locked'
          }
        }
      }
    },
    '/api/predict/forecast': {
      post: {
        summary: 'Spatio-Temporal Atmospheric Forecast Synthesis',
        description: 'Generates 72-hour probabilistic air quality trajectory with Gemini thinking synthesis and confidence bounds.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ForecastRequest' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Forecast synthesis generated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    cityName: { type: 'string' },
                    summaryMarkdown: { type: 'string' },
                    modelUsed: { type: 'string' },
                    timestamp: { type: 'string', format: 'date-time' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/policy/simulate': {
      post: {
        summary: 'Executive Policy & Emission Intervention Simulator',
        description: 'Simulates atmospheric mitigation scenarios using physics advection-diffusion modeling and AI impact assessment.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PolicySimulationRequest' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Policy simulation computed'
          }
        }
      }
    },
    '/api/routes': {
      get: {
        summary: 'List Saved Clean Air Transit Routes',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'Array of user saved clean air navigation routes'
          }
        }
      }
    }
  }
};
