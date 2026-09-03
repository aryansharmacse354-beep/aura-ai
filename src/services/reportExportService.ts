// Report Export Service for Policy Simulations and Health Advisory Briefings
import { PolicySimulationResult, PolicyIntervention, AQIMeasurement, UserProfile } from '../types';

export type ReportFormat = 'markdown' | 'html_print' | 'json' | 'csv';

class ReportExportService {
  /**
   * Triggers browser download of a file from string content
   */
  private triggerDownload(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Opens an HTML report in a new printable window or triggers print
   */
  public printHtmlReport(htmlContent: string): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      // Fallback: download as .html file
      this.triggerDownload(htmlContent, 'aurapredict_report.html', 'text/html;charset=utf-8');
      return;
    }
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }

  /**
   * Export Policy Simulation Result
   */
  public exportPolicySimulation(
    result: PolicySimulationResult,
    targetCity: string,
    levers: PolicyIntervention[],
    format: ReportFormat
  ): void {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const safeTitle = (result.scenarioName || 'policy_simulation').toLowerCase().replace(/[^a-z0-9]/g, '_');

    if (format === 'json') {
      const payload = {
        meta: {
          platform: 'AuraPredict AI Municipal Policy Engine',
          version: '3.6-Neural',
          exportedAt: new Date().toISOString(),
          targetCity
        },
        scenario: {
          name: result.scenarioName,
          levers: levers.map((l) => ({
            id: l.id,
            name: l.name,
            sliderValue: l.sliderValue,
            unit: l.unit,
            description: l.description
          }))
        },
        results: {
          baselineAvgAQI: result.currentAvgAQI,
          projectedAvgAQI: result.newAvgAQI,
          reductionPercent: result.projectedAQIReductionPercent,
          estimatedCostMillionUSD: result.estimatedCostMillionUSD,
          implementationTimeMonths: result.implementationTimeMonths,
          confidenceInterval: result.confidenceInterval,
          sectorImpacts: result.sectorImpacts,
          districtImpacts: result.districtImpacts,
          aiAnalysisNarrative: result.aiAnalysisNarrative
        }
      };
      this.triggerDownload(
        JSON.stringify(payload, null, 2),
        `aurapredict_policy_${safeTitle}_${timestamp}.json`,
        'application/json'
      );
      return;
    }

    if (format === 'csv') {
      let csv = 'Type,Name,Before_Value,After_Value,Reduction_Percent,Unit_or_Cost\n';
      csv += `Overall,${result.scenarioName || 'Simulation'},${result.currentAvgAQI},${result.newAvgAQI},${result.projectedAQIReductionPercent}%,$${result.estimatedCostMillionUSD}M\n`;

      (result.sectorImpacts || []).forEach((s) => {
        csv += `Sector,"${s.sector}",N/A,N/A,${s.reductionPercent}%,N/A\n`;
      });

      (result.districtImpacts || []).forEach((d) => {
        const dropPct = Math.round(((d.beforeAQI - d.afterAQI) / d.beforeAQI) * 100);
        csv += `District,"${d.districtName}",${d.beforeAQI},${d.afterAQI},${dropPct}%,AQI\n`;
      });

      this.triggerDownload(csv, `aurapredict_policy_data_${timestamp}.csv`, 'text/csv;charset=utf-8');
      return;
    }

    if (format === 'markdown') {
      const md = `# AuraPredict AI — Municipal Clean Air Policy Simulation Dossier
**Target Municipality:** ${targetCity}  
**Scenario Title:** ${result.scenarioName}  
**Simulation Date:** ${new Date().toLocaleString()}  
**AI Forecasting Engine:** Gemini 3.6 Flash Policy Net (Confidence: ${result.confidenceInterval || '± 8%'})  

---

## 1. Executive Summary & Key Projections
- **Baseline Ambient AQI:** ${result.currentAvgAQI} AQI
- **Projected Post-Intervention AQI:** ${result.newAvgAQI} AQI
- **Total Projected AQI Reduction:** **-${result.projectedAQIReductionPercent}%**
- **Estimated Municipal Budget:** **$${result.estimatedCostMillionUSD} Million USD**
- **Target Implementation Runway:** **${result.implementationTimeMonths} Months**

---

## 2. Policy Intervention Levers Configured
| Intervention Lever | Setting | Target Scope & Description |
| :--- | :---: | :--- |
${levers.map((l) => `| **${l.name}** | \`${l.sliderValue} ${l.unit}\` | ${l.description} |`).join('\n')}

---

## 3. Sector-by-Sector Emission Reductions
| Target Economic Sector | Forecasted Emission Drop |
| :--- | :---: |
${(result.sectorImpacts || []).map((s) => `| ${s.sector} | **-${s.reductionPercent}%** |`).join('\n')}

---

## 4. District-Level Spatial Dispersion Impacts
| Urban District / Grid Node | Baseline AQI | Projected AQI | Net Improvement |
| :--- | :---: | :---: | :---: |
${(result.districtImpacts || []).map((d) => `| ${d.districtName} | ${d.beforeAQI} | **${d.afterAQI}** | -${Math.round(((d.beforeAQI - d.afterAQI) / d.beforeAQI) * 100)}% |`).join('\n')}

---

## 5. Gemini GenAI Strategic Executive Briefing
> ${result.aiAnalysisNarrative}

---
*Report automatically generated by AuraPredict AI Generative Spatio-Temporal Environmental Platform.*
`;
      this.triggerDownload(md, `aurapredict_policy_${safeTitle}_${timestamp}.md`, 'text/markdown;charset=utf-8');
      return;
    }

    if (format === 'html_print') {
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AuraPredict AI — Policy Simulation: ${result.scenarioName}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.5; color: #1e293b; max-width: 900px; margin: 0 auto; padding: 40px 24px; }
    .header { border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 24px; }
    .title { font-size: 24px; font-weight: 800; color: #047857; margin: 0 0 4px 0; }
    .subtitle { font-size: 14px; color: #64748b; margin: 0; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 24px 0; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; }
    .card-label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; }
    .card-val { font-size: 22px; font-weight: 800; color: #047857; font-family: monospace; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0 24px 0; font-size: 13px; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
    th { background: #f1f5f9; font-weight: 700; }
    .narrative-box { background: #ecfdf5; border-left: 4px solid #10b981; padding: 14px; border-radius: 4px; margin: 20px 0; font-size: 13px; color: #065f46; }
    .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 11px; color: #94a3b8; text-align: center; }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <div>
        <h1 class="title">AuraPredict AI — Municipal Clean Air Policy Dossier</h1>
        <p class="subtitle">Scenario: <strong>${result.scenarioName}</strong> | Municipality: <strong>${targetCity}</strong> | Date: ${new Date().toLocaleDateString()}</p>
      </div>
      <button class="no-print" onclick="window.print()" style="background:#10b981; color:white; border:none; padding:8px 16px; border-radius:6px; font-weight:bold; cursor:pointer;">Print / Save PDF</button>
    </div>
  </div>

  <div class="grid">
    <div class="card">
      <div class="card-label">Projected AQI Drop</div>
      <div class="card-val">-${result.projectedAQIReductionPercent}%</div>
      <div style="font-size:11px; color:#64748b;">${result.currentAvgAQI} → ${result.newAvgAQI} AQI</div>
    </div>
    <div class="card">
      <div class="card-label">Budget Estimate</div>
      <div class="card-val" style="color:#0284c7;">$${result.estimatedCostMillionUSD}M</div>
      <div style="font-size:11px; color:#64748b;">Municipal Allocation</div>
    </div>
    <div class="card">
      <div class="card-label">Implementation</div>
      <div class="card-val" style="color:#d97706;">${result.implementationTimeMonths} Mos</div>
      <div style="font-size:11px; color:#64748b;">Deployment Horizon</div>
    </div>
    <div class="card">
      <div class="card-label">Model Confidence</div>
      <div class="card-val" style="font-size:18px; color:#475569;">${result.confidenceInterval || '± 8%'}</div>
      <div style="font-size:11px; color:#64748b;">Gemini 3.6 Neural Net</div>
    </div>
  </div>

  <h3>Configured Policy Intervention Levers</h3>
  <table>
    <thead>
      <tr>
        <th>Policy Measure</th>
        <th>Setting</th>
        <th>Scope & Mechanism</th>
      </tr>
    </thead>
    <tbody>
      ${levers
        .map(
          (l) => `<tr>
        <td><strong>${l.name}</strong></td>
        <td><code>${l.sliderValue} ${l.unit}</code></td>
        <td>${l.description}</td>
      </tr>`
        )
        .join('')}
    </tbody>
  </table>

  <h3>Sector Emission Reductions</h3>
  <table>
    <thead>
      <tr>
        <th>Target Economic Sector</th>
        <th>Projected Emission Drop</th>
      </tr>
    </thead>
    <tbody>
      ${(result.sectorImpacts || [])
        .map(
          (s) => `<tr>
        <td>${s.sector}</td>
        <td><strong style="color:#047857;">-${s.reductionPercent}%</strong></td>
      </tr>`
        )
        .join('')}
    </tbody>
  </table>

  <h3>District Spatial Impact Breakdown</h3>
  <table>
    <thead>
      <tr>
        <th>District / Zone</th>
        <th>Baseline AQI</th>
        <th>Post-Intervention AQI</th>
        <th>Delta</th>
      </tr>
    </thead>
    <tbody>
      ${(result.districtImpacts || [])
        .map(
          (d) => `<tr>
        <td><strong>${d.districtName}</strong></td>
        <td style="color:#dc2626;">${d.beforeAQI}</td>
        <td style="color:#047857; font-weight:bold;">${d.afterAQI}</td>
        <td>-${Math.round(((d.beforeAQI - d.afterAQI) / d.beforeAQI) * 100)}%</td>
      </tr>`
        )
        .join('')}
    </tbody>
  </table>

  <h3>Gemini Strategic Executive Briefing</h3>
  <div class="narrative-box">
    <strong>Executive Commentary:</strong><br>
    ${result.aiAnalysisNarrative}
  </div>

  <div class="footer">
    AuraPredict AI Environmental Platform &bull; Exported at ${new Date().toISOString()} &bull; Confidential Municipal Analysis
  </div>
</body>
</html>`;
      this.printHtmlReport(html);
    }
  }

  /**
   * Export Personalized Health Advisory Briefing
   */
  public exportHealthBriefing(
    user: UserProfile,
    cityData: AQIMeasurement,
    aiAdvisorNotes: string,
    format: ReportFormat
  ): void {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const safeName = (user.name || 'user').toLowerCase().replace(/[^a-z0-9]/g, '_');

    if (format === 'json') {
      const payload = {
        meta: {
          platform: 'AuraPredict AI Medical Health Advisory',
          exportedAt: new Date().toISOString(),
          patientName: user.name,
          healthSensitivities: user.healthConditions,
          alertThresholdAQI: user.alertThresholdAQI
        },
        environmentalExposure: {
          city: cityData.cityName,
          country: cityData.country,
          currentAQI: cityData.aqi,
          category: cityData.aqiCategory,
          primaryPollutant: cityData.primaryPollutant,
          pollutants: cityData.pollutants,
          meteorology: cityData.weather
        },
        medicalGuidance: {
          riskLevel: cityData.aqi > 200 ? 'Severe Hazard' : cityData.aqi > 120 ? 'Elevated' : 'Low',
          aiClinicalBriefing: aiAdvisorNotes,
          doctorRecommendations: [
            cityData.aqi > 150 ? 'Wear NIOSH-approved N95 or FFP2 respirator outdoors' : 'Standard outdoor activities permissible with caution',
            'Operate indoor True-HEPA H13 air filtration with windows sealed',
            'Avoid intense cardiovascular exercise near primary arterial traffic corridors'
          ]
        }
      };
      this.triggerDownload(
        JSON.stringify(payload, null, 2),
        `aurapredict_health_report_${safeName}_${timestamp}.json`,
        'application/json'
      );
      return;
    }

    if (format === 'markdown') {
      const md = `# AuraPredict AI — Personalized Patient Health Advisory Briefing
**Patient Name:** ${user.name || 'Confidential Patient'}  
**Email:** ${user.email}  
**Date of Report:** ${new Date().toLocaleString()}  
**Location Monitored:** ${cityData.cityName}, ${cityData.country}  
**Active Exposure Level:** **${cityData.aqi} AQI (${cityData.aqiCategory})**  

---

## 1. Patient Health Profile Sensitivities
${user.healthConditions.length > 0 ? user.healthConditions.map((c) => `- **${c.replace('_', ' ').toUpperCase()}**`).join('\n') : '- General Population (No specified chronic sensitivities)'}
- **User Push Alert Threshold:** \`${user.alertThresholdAQI || 120} AQI\`

---

## 2. Ambient Environmental Exposure Metrics
| Speciated Pollutant | Measured Concentration | WHO Safe Benchmark Limit | Exposure % of Limit | Health Risk Category |
| :--- | :---: | :---: | :---: | :--- |
${cityData.pollutants
  .map(
    (p) =>
      `| **${p.name}** | ${p.value} ${p.unit} | ${p.limit} ${p.unit} | **${p.percentOfLimit}%** | ${p.category} |`
  )
  .join('\n')}

- **Dominant Toxicant:** ${cityData.primaryPollutant}
- **Boundary Layer / Inversion Height:** ${cityData.weather.boundaryLayerHeightM} meters
- **Ambient Temperature / Humidity:** ${cityData.weather.tempC}°C / ${cityData.weather.humidity}%

---

## 3. Gemini Medical Environmental AI Guidance
> ${aiAdvisorNotes}

---

## 4. Clinically Recommended Protective Actions
1. **Respiratory Filtration:** ${cityData.aqi > 150 ? 'Wear a certified N95 / FFP2 respirator whenever outdoors. Surgical masks are ineffective against fine particulate matter (PM2.5).' : 'Cloth or basic mask adequate unless sensitive.'}
2. **Indoor Air Isolation:** Maintain indoor clean rooms with HEPA (CADR > 250 m³/h) air purifiers running continuously. Keep windows and air intake dampers closed.
3. **Cardiovascular & Exercise Modifications:** Restrict endurance cardio, high-volume outdoor running, or heavy labor between 06:00-09:00 and 19:00-23:00 when inversion layers trap pollutants.
4. **Hydration & Medication:** Keep prescribed quick-relief inhalers (e.g. Albuterol) readily accessible.

---
*AuraPredict AI Health Briefing is an environmental risk advisory tool. For acute clinical emergencies, consult a licensed healthcare professional.*
`;
      this.triggerDownload(md, `aurapredict_health_report_${safeName}_${timestamp}.md`, 'text/markdown;charset=utf-8');
      return;
    }

    if (format === 'html_print') {
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AuraPredict AI — Personalized Patient Health Advisory: ${user.name}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.5; color: #0f172a; max-width: 860px; margin: 0 auto; padding: 36px 20px; }
    .header { border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
    .brand { font-size: 20px; font-weight: 800; color: #059669; }
    .patient-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin: 16px 0; }
    .exposure-badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-weight: bold; font-size: 13px; ${cityData.aqi > 200 ? 'background:#fee2e2; color:#b91c1c;' : 'background:#fef3c7; color:#b45309;'} }
    table { width: 100%; border-collapse: collapse; margin: 16px 0 20px 0; font-size: 13px; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
    th { background: #f1f5f9; font-weight: 700; }
    .guidance-box { background: #ecfdf5; border-left: 4px solid #10b981; padding: 14px; border-radius: 4px; margin: 16px 0; font-size: 13px; color: #065f46; }
    .action-list li { margin-bottom: 8px; font-size: 13px; }
    .footer { margin-top: 36px; border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 11px; color: #94a3b8; text-align: center; }
    @media print { .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">AuraPredict AI — Environmental Health Advisory</div>
      <h2 style="margin:4px 0; font-size:18px;">Patient Personalized Exposure & Clinical Risk Report</h2>
      <div style="font-size:12px; color:#64748b;">Issued: ${new Date().toLocaleString()} | City: ${cityData.cityName}, ${cityData.country}</div>
    </div>
    <button class="no-print" onclick="window.print()" style="background:#059669; color:white; border:none; padding:8px 16px; border-radius:6px; font-weight:bold; cursor:pointer;">Print / Save PDF</button>
  </div>

  <div class="patient-card">
    <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; font-size:12px;">
      <div><strong>Patient Name:</strong> ${user.name}</div>
      <div><strong>Active AQI:</strong> <span class="exposure-badge">${cityData.aqi} AQI (${cityData.aqiCategory})</span></div>
      <div><strong>Primary Toxicant:</strong> <span style="font-family:monospace; font-weight:bold;">${cityData.primaryPollutant}</span></div>
    </div>
    <div style="margin-top:8px; font-size:12px;">
      <strong>Identified Sensitivities:</strong> ${(user.healthConditions || []).join(', ') || 'None specified'}
    </div>
  </div>

  <h3>Speciated Toxicant Inhalation Risk</h3>
  <table>
    <thead>
      <tr>
        <th>Pollutant</th>
        <th>Measured Value</th>
        <th>WHO Guideline Benchmark</th>
        <th>% of Limit</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${cityData.pollutants
        .map(
          (p) => `<tr>
        <td><strong>${p.name}</strong></td>
        <td>${p.value} ${p.unit}</td>
        <td>${p.limit} ${p.unit}</td>
        <td><strong style="color:${p.percentOfLimit > 100 ? '#b91c1c' : '#059669'};">${p.percentOfLimit}%</strong></td>
        <td>${p.category}</td>
      </tr>`
        )
        .join('')}
    </tbody>
  </table>

  <h3>Gemini Medical AI Personalized Guidance</h3>
  <div class="guidance-box">
    ${aiAdvisorNotes}
  </div>

  <h3>Prescribed Preventive Protocol</h3>
  <ul class="action-list">
    <li><strong>Respiratory Filtration:</strong> ${cityData.aqi > 150 ? 'Wear an N95/FFP2 respirator with active seal check.' : 'Standard precautionary face coverings for sensitive groups.'}</li>
    <li><strong>Indoor Microclimate:</strong> Seal window gaps and run HEPA air filtration. Maintain indoor humidity between 40-50%.</li>
    <li><strong>Activity Timing:</strong> Avoid outdoor aerobic exertion during morning inversion peak hours.</li>
  </ul>

  <div class="footer">
    AuraPredict AI &bull; Personalized Patient Advisory &bull; Not a substitute for emergency medical care.
  </div>
</body>
</html>`;
      this.printHtmlReport(html);
    }
  }
}

export const reportExportService = new ReportExportService();
