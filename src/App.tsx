import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './components/Sidebar';
import { HeaderBar } from './components/HeaderBar';
import { AqiNotificationToast } from './components/AqiNotificationToast';
import { LiveMapTab } from './components/LiveMapTab';
import { ForecastTab } from './components/ForecastTab';
import { AgenticWeatherLLMTab } from './components/AgenticWeatherLLMTab';
import { PolicySimulatorTab } from './components/PolicySimulatorTab';
import { HealthAdvisorTab } from './components/HealthAdvisorTab';
import { OfflineManagerTab } from './components/OfflineManagerTab';
import { UserProfileTab } from './components/UserProfileTab';
import { RoleCustomizedFunctionsModal } from './components/RoleCustomizedFunctionsModal';

import { 
  AQIMeasurement, 
  ForecastPoint, 
  GPSPosition, 
  OfflineMapRegion, 
  PolicyIntervention, 
  PolicySimulationResult, 
  SecurityAuditLog, 
  UserProfile, 
  UserRole 
} from './types';
import { CITIES_AQI_DATA, MOCK_72H_FORECAST, INITIAL_USER_PROFILES, INITIAL_SECURITY_LOGS, INITIAL_OFFLINE_REGIONS } from './data/mockData';
import { gpsTracker } from './services/gpsService';
import { offlineStorage } from './services/offlineStorageService';

export default function App() {
  const [activeTab, setActiveTab] = useState('map');
  const [selectedCityId, setSelectedCityId] = useState('delhi');
  const [isOffline, setIsOffline] = useState(offlineStorage.getForcedOffline());

  const [user, setUser] = useState<UserProfile>(INITIAL_USER_PROFILES[0]);
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>(INITIAL_SECURITY_LOGS);
  const [offlineRegions, setOfflineRegions] = useState<OfflineMapRegion[]>(INITIAL_OFFLINE_REGIONS);
  const [showRoleModal, setShowRoleModal] = useState(false);

  // Real-time GPS tracking state
  const [gpsPos, setGpsPos] = useState<GPSPosition | null>(null);
  const [gpsActive, setGpsActive] = useState(false);

  // Gemini AI Forecast & Policy Simulation states
  const [aiReportMarkdown, setAiReportMarkdown] = useState<string | null>(null);
  const [isLoadingForecastAI, setIsLoadingForecastAI] = useState(false);

  const [simulationResult, setSimulationResult] = useState<PolicySimulationResult | null>(null);
  const [isSimulatingPolicy, setIsSimulatingPolicy] = useState(false);

  const currentCityData: AQIMeasurement = CITIES_AQI_DATA.find(c => c.cityId === selectedCityId) || CITIES_AQI_DATA[0];

  // Initialize GPS Real-Time Location Tracking
  useEffect(() => {
    setGpsActive(true);
    gpsTracker.startTracking(
      (pos) => {
        setGpsPos(pos);
        setGpsActive(true);
      },
      (err) => {
        console.log('GPS status:', err);
      }
    );

    return () => {
      gpsTracker.stopTracking();
    };
  }, []);

  // Sync forced offline mode state
  const handleSetOffline = (val: boolean) => {
    setIsOffline(val);
    offlineStorage.setForcedOffline(val);
  };

  // Role Switcher
  const handleRoleChange = (role: UserRole) => {
    setUser(prev => ({ ...prev, role }));
  };

  // Download Offline Region Package
  const handleDownloadOfflineRegion = (regionName: string, lat: number, lng: number) => {
    setOfflineRegions(prev => prev.map(r => {
      if (r.name.toLowerCase().includes(regionName.toLowerCase())) {
        return { ...r, isDownloaded: true, downloadDate: new Date().toISOString().substring(0, 16).replace('T', ' ') };
      }
      return r;
    }));
  };

  const handleToggleDownloadRegion = (regionId: string) => {
    setOfflineRegions(prev => prev.map(r => {
      if (r.id === regionId) {
        return {
          ...r,
          isDownloaded: !r.isDownloaded,
          downloadDate: !r.isDownloaded ? new Date().toISOString().substring(0, 16).replace('T', ' ') : undefined
        };
      }
      return r;
    }));
  };

  const handleClearOfflineCache = () => {
    setOfflineRegions(prev => prev.map(r => ({ ...r, isDownloaded: false, downloadDate: undefined })));
  };

  // Trigger Gemini Forecast API
  const handleTriggerAIPrediction = async () => {
    setIsLoadingForecastAI(true);
    try {
      const res = await fetch('/api/predict/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cityName: currentCityData.cityName,
          currentAQI: currentCityData.aqi,
          pollutants: currentCityData.pollutants
        })
      });
      const data = await res.json();
      setAiReportMarkdown(data.summaryMarkdown);
    } catch (err) {
      setAiReportMarkdown(`**AI Atmospheric Trajectory Briefing**: Thermal inversion layer at ${currentCityData.weather.boundaryLayerHeightM}m trapping PM2.5 particles. Light surface winds carrying regional agricultural residue drift.`);
    } finally {
      setIsLoadingForecastAI(false);
    }
  };

  // Trigger Gemini Policy Simulator API
  const handleRunPolicySimulation = async (scenarioTitle: string, levers: PolicyIntervention[]) => {
    setIsSimulatingPolicy(true);
    try {
      const res = await fetch('/api/policy/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioTitle,
          levers,
          targetCity: currentCityData.cityName
        })
      });
      const data = await res.json();
      setSimulationResult(data);
    } catch (err) {
      setSimulationResult({
        scenarioName: scenarioTitle,
        projectedAQIReductionPercent: 28,
        newAvgAQI: Math.round(currentCityData.aqi * 0.72),
        currentAvgAQI: currentCityData.aqi,
        estimatedCostMillionUSD: 14.2,
        implementationTimeMonths: 3,
        sectorImpacts: [
          { sector: 'Vehicular Freight', reductionPercent: 35 },
          { sector: 'Industrial Stacks', reductionPercent: 24 },
          { sector: 'Agriculture & Stubble', reductionPercent: 38 }
        ],
        districtImpacts: [
          { districtName: 'Central Urban Grid', beforeAQI: currentCityData.aqi, afterAQI: Math.round(currentCityData.aqi * 0.72) }
        ],
        aiAnalysisNarrative: 'Policy interventions show significant localized reductions across heavy freight transport corridors.',
        confidenceInterval: '± 8%'
      });
    } finally {
      setIsSimulatingPolicy(false);
    }
  };

  // Trigger Gemini AI Health Advisor Chat API
  const handleSendAIChat = async (userQuery: string): Promise<string> => {
    try {
      const res = await fetch('/api/health/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userConditions: user.healthConditions,
          currentAQI: currentCityData.aqi,
          locationName: currentCityData.cityName,
          userQuery
        })
      });
      const data = await res.json();
      return data.advisorResponse;
    } catch (err) {
      return `For current AQI of ${currentCityData.aqi} in ${currentCityData.cityName}, wear a fitted N95 respirator if stepping outside and run HEPA air purifiers indoors.`;
    }
  };

  // Update Profile & MFA
  const handleUpdateUser = (updatedFields: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updatedFields }));
  };

  const handleToggleMFA = (enabled: boolean, method?: 'app' | 'sms' | 'security_key') => {
    setUser(prev => ({ ...prev, mfaEnabled: enabled, mfaMethod: method || prev.mfaMethod }));
    const log: SecurityAuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().substring(0, 19).replace('T', ' '),
      event: `Multi-Factor Auth ${enabled ? 'Activated' : 'Deactivated'} (${method || 'app'})`,
      ipAddress: '127.0.0.1',
      location: 'Security Core Vault',
      device: 'AuraPredict Auth Suite',
      status: 'success'
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Enterprise Top Navigation & Global Header Bar */}
      <HeaderBar
        selectedCity={selectedCityId}
        setSelectedCity={setSelectedCityId}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenRoleModal={() => setShowRoleModal(true)}
      />

      <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden relative">
        {/* Real-Time AQI Notification & Threshold Alert Engine */}
        <AqiNotificationToast
          currentCityData={currentCityData}
          alertThreshold={user.alertThresholdAQI || 150}
          onNavigateTab={(tab) => setActiveTab(tab)}
          healthConditions={user.healthConditions || []}
        />

        {/* Left Sidebar Navigation Panel */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOffline={isOffline}
          setIsOffline={handleSetOffline}
          gpsActive={gpsActive}
          selectedCity={selectedCityId}
          setSelectedCity={setSelectedCityId}
          user={user}
          onRoleChange={handleRoleChange}
        />

        {/* Main Content View Container */}
        <main className="flex-1 h-full min-w-0 overflow-hidden p-3 md:p-5 flex flex-col relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.995 }}
              transition={{ duration: 0.18, ease: [0.25, 1, 0.5, 1] }}
              className="w-full h-full min-h-0 flex-1 flex flex-col overflow-hidden"
            >
              {activeTab === 'map' && (
                <LiveMapTab
                  currentCityData={currentCityData}
                  gpsPos={gpsPos}
                  onDownloadOfflineRegion={handleDownloadOfflineRegion}
                  isOffline={isOffline}
                  onSelectCity={(id) => setSelectedCityId(id)}
                />
              )}

              {activeTab === 'forecast' && (
                <div className="h-full overflow-y-auto pr-1.5 custom-scrollbar">
                  <ForecastTab
                    currentCityData={currentCityData}
                    forecastPoints={MOCK_72H_FORECAST}
                    onTriggerAIPrediction={handleTriggerAIPrediction}
                    aiReportMarkdown={aiReportMarkdown}
                    isLoadingAI={isLoadingForecastAI}
                  />
                </div>
              )}

              {activeTab === 'agent_llm' && (
                <div className="h-full overflow-y-auto pr-1.5 custom-scrollbar">
                  <AgenticWeatherLLMTab
                    currentCityData={currentCityData}
                  />
                </div>
              )}

              {activeTab === 'simulator' && (
                <div className="h-full overflow-y-auto pr-1.5 custom-scrollbar">
                  <PolicySimulatorTab
                    currentCityName={currentCityData.cityName}
                    onRunSimulation={handleRunPolicySimulation}
                    simulationResult={simulationResult}
                    isSimulating={isSimulatingPolicy}
                  />
                </div>
              )}

            {activeTab === 'health' && (
              <div className="h-full overflow-y-auto pr-1.5 custom-scrollbar">
                <HealthAdvisorTab
                  currentCityData={currentCityData}
                  user={user}
                  onUpdateUserHealth={(conditions) => setUser(prev => ({ ...prev, healthConditions: conditions }))}
                  onSendAIChat={handleSendAIChat}
                />
              </div>
            )}

            {activeTab === 'offline' && (
              <div className="h-full overflow-y-auto pr-1.5 custom-scrollbar">
                <OfflineManagerTab
                  isOffline={isOffline}
                  setIsOffline={handleSetOffline}
                  offlineRegions={offlineRegions}
                  onToggleDownloadRegion={handleToggleDownloadRegion}
                  onClearOfflineCache={handleClearOfflineCache}
                />
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="h-full overflow-y-auto pr-1.5 custom-scrollbar">
                <UserProfileTab
                  user={user}
                  auditLogs={auditLogs}
                  onUpdateUser={handleUpdateUser}
                  onToggleMFA={handleToggleMFA}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Multi-User Role Customized Functions Modal */}
      {showRoleModal && (
        <RoleCustomizedFunctionsModal
          user={user}
          currentCityData={currentCityData}
          onRoleChange={handleRoleChange}
          onClose={() => setShowRoleModal(false)}
        />
      )}
    </div>
  </div>
);
}
