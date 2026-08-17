import { Router } from 'express';
import { openApiSpec } from '../openapi';

export const docsRouter = Router();

// Endpoint providing raw OpenAPI 3.0 specification JSON
docsRouter.get('/openapi.json', (req, res) => {
  res.json(openApiSpec);
});

// Interactive Swagger / OpenAPI HTML visualizer
docsRouter.get('/docs', (req, res) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>AuraPredict AI — Interactive API Documentation</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
  <style>
    body { margin: 0; background: #090d16; font-family: sans-serif; }
    .swagger-ui .topbar { display: none; }
    .swagger-ui { filter: invert(88%) hue-rotate(180deg); max-width: 1200px; margin: 0 auto; padding: 20px; }
    .header-banner { background: #0f172a; padding: 20px; text-align: center; border-bottom: 1px solid #1e293b; }
    .header-banner h1 { color: #10b981; font-size: 22px; margin: 0; }
    .header-banner p { color: #94a3b8; font-size: 13px; margin: 5px 0 0; }
  </style>
</head>
<body>
  <div class="header-banner">
    <h1>AuraPredict AI — Atmospheric OpenAPI 3.0 Documentation</h1>
    <p>Real-time PINN forecasting, GNN dispersion telemetry, GenAI policy simulations, and clean-air navigation routing endpoints.</p>
  </div>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js" crossorigin></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: '/api/openapi.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.SwaggerUIStandalonePreset
        ],
        layout: "BaseLayout"
      });
    };
  </script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});
