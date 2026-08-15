# AuraPredict AI — Enterprise Atmospheric Intelligence & Proactive Mitigation Platform

AuraPredict AI is a full-stack, enterprise-grade generative spatio-temporal air quality forecasting, atmospheric physics modeling, multi-turn AI reasoning, and proactive clean-air mitigation system. It combines physics-informed machine learning, real-time GPS telemetry, offline edge GIS mapping, exposure-minimizing route navigation, multi-agent climate consensus swarms, Gemini multi-turn reasoning with High Thinking mode, speech-to-text audio transcription, synthetic satellite image diffusion with 8 aspect ratios, and GenAI policy simulation.

---

## Key Features & System Modules

### 1. Gemini AI Intelligence & Chatbot (`GeminiChatbotTab.tsx`)

- **Multi-Turn Atmospheric Reasoning Agent**
  - Full conversation history retention and multi-turn context awareness powered by Gemini.
  - Multi-expert persona system instructions:
    - **Atmospheric Chemist**: VOC/$NO_x$ photochemistry, secondary organic aerosol (SOA) formation, reaction rate kinetics ($k_{OH}$), and ozone isopleths.
    - **Environmental Epidemiologist**: Inhalation toxicology, alveolar particulate deposition, pediatric pulmonary defense, and respirator interventions.
    - **GIS & Remote Sensing Specialist**: Sentinel-5P TROPOMI column retrieval, MODIS AOD inversions, Spatio-Temporal Graph Neural Networks (ST-GNN), and Kriging interpolation.
    - **Environmental Policy Strategist**: Low-emission zone (LEZ) design, industrial stack throttling economics, and macroeconomic cost-benefit modeling.
    - **Instant Sensor Triage**: Ultra-low latency responses (<300ms) for urgent air index facts and safety alerts.
  - **High Thinking Mode (`ThinkingLevel.HIGH`)**: Unconstrained mathematical and chemical derivation capabilities without arbitrary output token limits using `gemini-3.1-pro-preview`.
  - **Low-Latency Mode**: Instantaneous sub-second telemetry analysis powered by `gemini-3.1-flash-lite`.
  - **Voice Audio Input & Speech-to-Text Transcription (`/api/gemini/transcribe`)**: Direct browser microphone recording transcribed seamlessly via `gemini-3.5-flash`.
  - **Speech Synthesis**: Real-time read-aloud playback of atmospheric responses via Web Speech Synthesis.

---

### 2. Satellite & Atmospheric Image Studio (`AtmosphericImageStudioTab.tsx`)

- **Aspect Ratio Control Engine**
  - Precision aspect ratio selection across all 8 standard and panoramic formats:
    - **1:1 Square** (800x800) — Social feeds & monitoring avatar cards.
    - **2:3 Portrait** (800x1200) — High-density environmental field posters.
    - **3:2 Landscape** (1200x800) — Classic 35mm optical framing.
    - **3:4 Vertical** (900x1200) — Tablet GIS report displays.
    - **4:3 Standard** (1200x900) — Desktop command deck visualizers.
    - **9:16 Vertical** (720x1280) — Mobile story and emergency alert feeds.
    - **16:9 Cinematic** (1280x720) — Widescreen HD satellite displays.
    - **21:9 Ultra-Wide** (1400x600) — Panoramic multi-monitor operational video walls.
  - **Resolution Engine**: Selectable 1K and 2K rendering tiers using `gemini-3.1-flash-image` with fallback synthetic spatial SVG engines.
  - **Atmospheric Prompt Presets**: Sentinel-5P Tropospheric $NO_2$ Columns, 3D Thermal Gaussian Plume Inversions, Green Canopy Clean-Air Corridors, and Smog Cap Meteorology.
  - **Gallery & Inspection**: Fullscreen lightbox inspector, copy prompt tool, and one-click PNG image downloading.

---

### 3. Geospatial & Dispersion Deck

- **3D / 2D Interactive Pollution Map (`LiveMapTab.tsx`)**
  - High-performance Leaflet GIS mapping with dynamic pollutant overlays.
  - Multi-ratio viewport modes: Standard (16:9), Cinematic Ultra-Wide (21:9), and Dual Split-Screen comparisons.
  - Interactive GNN monitoring station markers with live AQI telemetry, status badges, and hover tooltips.
  - On-map GIS navigation D-Pad (directional North, South, East, West pan controls, zoom `+`/`-`, current zoom telemetry `z{level}`).
  - Session view persistence via `localStorage` with explicit save, restore, and reset mechanisms.
  - Live real-time GPS user position pin tracking with accuracy circle and distance calculation.
  - Offline tile cache status indicators and dynamic AQI severity color legends.

- **Clean-Air Exposure Navigator (`CleanAirRouteNavigatorTab.tsx`)**
  - Micro-topography and green-canopy routing engine designed to minimize cumulative particulate inhalation dosage ($\mu\text{g PM2.5}$).
  - Comparative path analysis: *Clean-Air Canopy Route*, *Fastest Highway Arterial*, and *Balanced Commute*.
  - Activity mobility modes with physiological breathing ventilation rates: Walking (18 L/min), Cycling (38 L/min), Jogging (60 L/min), and Driving (12 L/min).
  - Interactive turn-by-turn waypoint visualizer with elevation/pollution profile and animated commute playback simulation.

- **Gaussian Plume Dispersion & Point-Source Physics Lab (`PlumeDispersionLabTab.tsx`)**
  - Physics-based steady-state Gaussian plume dispersion modeling with Pasquill-Gifford atmospheric stability classes ($A$ through $F$).
  - Dynamic parameter controls: Emission rate ($Q$ in g/s), physical stack height ($h_s$), buoyant plume rise ($\Delta h$), effective stack height ($H$), wind speed ($u$), and inversion boundary layer lid height ($z_i$).
  - Preset industrial emitters: Supercritical Thermal Coal Plant, Highway Freight Arterial, Agricultural Stubble Blaze, and Steel Smelter.
  - Active abatement scrubbers: Flue Gas Desulfurization (FGD), Electrostatic Precipitators (ESP), and operational curtailment.
  - Real-time HTML5 Canvas 2D spatial plume contour rendering and downwind ground-level concentration charts.

---

### 2. Atmospheric AI & Physics Deck

- **Atmospheric ML Lab — 20 Expert Formulations (`AtmosphericMLLabTab.tsx`)**
  - Complete architectural specifications, LaTeX formulations, and production PyTorch implementations across 20 atmospheric machine learning domains:
    1. Physics-Informed Neural Networks (PINNs) with Navier-Stokes advection-diffusion loss.
    2. Photochemical $O_3$-$NO_x$ equilibrium and secondary organic aerosol kinetics.
    3. Spatio-Temporal Graph Neural Networks (ST-GNN) for sensor network topology.
    4. Multi-Horizon Temporal Transformers for probabilistic uncertainty forecasting.
    5. Satellite Remote Sensing Optical Ingestion (Sentinel-5P TROPOMI & MODIS AOD).
    6. Low-Cost IoT Sensor Calibration & Drift Correction (Kriging / Random Forest).
    7. Nocturnal Thermal Inversion Layer Trapping & PBLH Dynamics.
    8. Agricultural Biomass Burning & Wildfire Smoke Drift Trajectory.
    9. Transboundary Gobi Dust Storm & Regional Particulate Transport.
    10. Industrial Fugitive Emissions & Point-Source Inverse Dispersion.
    11. Extreme Smog Event Early Warning ($>300$ AQI Peak Anticipation).
    12. Boundary Layer Meteorological Feature Engineering.
    13. Transfer Learning Across Heterogeneous Climate Basins.
    14. Continuous Online Learning & Concept Drift Adaptation.
    15. Multi-Objective Policy Optimization & Macro-Intervention Levers.
    16. Real-Time Low-Exposure Clean Corridor Routing Algorithms.
    17. Autonomous Drone UAV Aerial Sampling & In-Situ Spatial Ingestion.
    18. Smart Building HVAC Automated Pre-Filter Interlock Protocols.
    19. Public Health Burden & Cardiovascular Inhalation Risk Quantification.
    20. Generative Spatiotemporal Diffusion Models for Synthetic Airfields.
  - Direct algorithm verification and live Gemini API execution with fallback engines.

- **10,000-Agent Distributed Weather Swarm (`AgenticWeatherLLMTab.tsx`)**
  - 10 parallel sub-swarms (1,000 nodes each) modeling climate consensus:
    - Sentinel-5P Satellite Ingestion Cluster
    - Ground IoT Micro-Sensor Mesh
    - PINNs Navier-Stokes Physics Solvers
    - GNN Spatial Topological Interpolators
    - 72h Spatio-Temporal LSTM Forecasters
    - Photochemical Speciation Engines
    - Urban Traffic Corridor Simulators
    - Bayesian Monte Carlo Bounds Estimators
    - Multi-User Policy & Clean-Path Optimizers
    - Autonomous UAV & Smart HVAC Controllers
  - Real-time thought chain audit logs, inference latency tracking, and confidence scoring.

- **72-Hour Spatio-Temporal Forecasting & Speciation (`ForecastTab.tsx`)**
  - Multi-horizon AQI forecasts with 95% Bayesian uncertainty confidence intervals.
  - Speciated pollutant tracking: $\text{PM}_{2.5}$, $\text{PM}_{10}$, $\text{NO}_2$, $\text{SO}_2$, $\text{CO}$, and $\text{O}_3$.
  - Automated source attribution (vehicular transport, industrial combustion, agricultural stubble, secondary inorganic aerosols).
  - D3.js-powered interactive trends dashboard (`D3TrendsDashboard.tsx`).
  - Model comparison view (`ForecastComparison.tsx`) benchmarks ST-GNN, PINNs, WRF-Chem, and Baseline persistence models.
  - Exportable text briefing reports and print-ready formats.

- **AQI Historical Data & Multi-Year Trends (`AQIHistoricalDataTab.tsx`)**
  - Granular historical perspectives: 7-Day Hourly, 30-Day Daily, 12-Month Seasonal, and 5-Year Multi-Annual trends.
  - WHO 24-hour exceedance limits and percentile metrics ($P_{50}$, $P_{90}$, $P_{99}$).
  - Analysis of historical extreme smog episodes (e.g., Post-Harvest Stubble Peak, Post-Festival Fireworks, Winter Thermal Inversion).
  - One-click CSV historical dataset export.

---

### 3. Operations & Governance Deck

- **Multi-User Action Suite (`MultiUserActionSuiteTab.tsx`)**
  - Role-customized operation suites:
    - **Municipal Environmental Agencies**: Odd-even vehicle rationing, industrial stack throttling, stubble enforcement, water mist cannons, and hospital admission averted estimators.
    - **Vulnerable Citizens**: Personalized physiological risk assessment, safe exertion timers, and N95/FFP3 respirator recommendations.
    - **Fleet & Transit Directors**: Low-emission zone rerouting, electric vehicle priority lanes, and freight delivery scheduling.
    - **Enterprise EHS Managers**: Automated HVAC air purifier pre-filter interlocks and outdoor worker shift scheduling.
    - **Community Field Annotations**: Pinned crowd-sourced incident logs, geo-tagged hazard notes, and upvoting.

- **GenAI Policy Simulator (`PolicySimulatorTab.tsx`)**
  - Interactive policy levers: Heavy Diesel Ban, Industrial Stack Cut, Bio-Decomposer Subsidies, Anti-Smog Water Cannons, and Electric Vehicle Low-Emission Zones.
  - Preset policy scenarios: Severe Smog Emergency, Green Transit LEZ Expansion, and Agricultural Clean Air Protocol.
  - Computes projected AQI reduction (%), estimated municipal budget ($M USD), implementation timeline (months), sectoral impacts, and AI executive analysis.
  - Multi-format report export (PDF, CSV, JSON, and Print layouts) and audio briefing synthesis.

- **Health & Exposure Shield (`HealthAdvisorTab.tsx`)**
  - Personalized health profile integration: Asthma, COPD, Cardiovascular Disease, Pregnancy, Elderly (65+), Pediatric (<12), Outdoor Field Worker, and Endurance Athlete.
  - AI Health Advisor Chat powered by Gemini for instant contextual outdoor advice and indoor filtration guidelines.
  - SpeechSynthesis voice read-aloud support with customizable pitch, speed, and volume.

---

### 4. Edge GIS & Security Vault

- **Offline Map & Telemetry Cache Engine (`OfflineManagerTab.tsx`)**
  - Offline-first vector tile and GNN telemetry package manager for major metropolitan areas (Delhi NCR, Mumbai, Bengaluru, Kolkata, Chennai, Beijing, London).
  - Local storage capacity monitoring (IndexedDB / WebStorage budget).
  - One-click forced offline mode testing and remote endpoint cache synchronization.

- **Security, Profile & MFA Vault (`UserProfileTab.tsx`)**
  - Enterprise Role-Based Access Control (RBAC): Citizen, Environmental Scientist, Policy Maker, Fleet Transit Director, and Enterprise EHS Manager.
  - Multi-Factor Authentication (MFA) configuration: Authenticator App (TOTP), SMS, and Hardware Security Key (FIDO2/WebAuthn).
  - Comprehensive security audit log ledger with timestamped event histories, IP addresses, and encrypted CSV log exports.
  - Custom user alert thresholds and saved geographical location coordinates.

---

## Global Services & Architecture

- **Real-Time GPS Tracking (`gpsService.ts`)**: Integrates browser Geolocation API with continuous watch positioning, speed/heading tracking, and high-precision simulated fallback coordinates.
- **Speech Synthesis Voice Broadcasts (`speechSynthesisService.ts`)**: Web Speech API audio broadcaster for real-time hazard warnings, health alerts, and policy briefing readouts.
- **Report Export Suite (`reportExportService.ts`)**: Generates structured PDF-ready HTML, CSV data sheets, JSON payloads, and clean print formats.
- **Dark / Light Theme Engine**: Persistent theme state stored in `localStorage` supporting high-contrast accessible layouts.
- **Resilient Server-Side Gemini AI (`server.ts`)**:
  - Express backend with Vite SPA middleware.
  - Powered by `@google/genai` utilizing `gemini-3.7-flash`, `gemini-3.1-flash-lite`, and `gemini-flash-latest`.
  - Resilient model cascade with fallback handling and physics-informed deterministic backup responses.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 18, TypeScript, Vite |
| **Styling & Icons** | Tailwind CSS, Lucide React |
| **Animation** | Motion (`motion/react`) |
| **Mapping & Geospatial** | Leaflet, HTML5 Canvas 2D |
| **Charts & Data Viz** | Recharts, D3.js |
| **Backend & APIs** | Node.js, Express, tsx, esbuild |
| **AI & Generative Models** | Google GenAI SDK (`@google/genai`), Gemini 3.7 Flash |
| **Audio & Speech** | Web SpeechSynthesis API |

---

## Getting Started

### 1. Environment Setup
Create a `.env` file in the root directory (based on `.env.example`):
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Development Server
Start the full-stack development server on port 3000:
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Production Build
Compile the frontend static assets and server bundle:
```bash
npm run build
npm start
```
