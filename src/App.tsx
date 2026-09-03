import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './components/Sidebar';
import { HeaderBar } from './components/HeaderBar';
import { AqiNotificationToast } from './components/AqiNotificationToast';
import { AQILogo } from './components/AQILogo';
import { TabLoadingSkeleton } from './components/TabLoadingSkeleton';
import { AppInstallModal } from './components/AppInstallModal';
import { ErrorBoundary } from './components/ErrorBoundary';

// Code Splitting / Lazy Loaded Modules to improve performance and initial bundle sizes
const LiveMapTab = lazy(() => import('./components/LiveMapTab').then(m => ({ default: m.LiveMapTab })));
const ForecastTab = lazy(() => import('./components/ForecastTab').then(m => ({ default: m.ForecastTab })));
const AgenticWeatherLLMTab = lazy(() => import('./components/AgenticWeatherLLMTab').then(m => ({ default: m.AgenticWeatherLLMTab })));
const PolicySimulatorTab = lazy(() => import('./components/PolicySimulatorTab').then(m => ({ default: m.PolicySimulatorTab })));
const HealthAdvisorTab = lazy(() => import('./components/HealthAdvisorTab').then(m => ({ default: m.HealthAdvisorTab })));
const OfflineManagerTab = lazy(() => import('./components/OfflineManagerTab').then(m => ({ default: m.OfflineManagerTab })));
const UserProfileTab = lazy(() => import('./components/UserProfileTab').then(m => ({ default: m.UserProfileTab })));
const RoleCustomizedFunctionsModal = lazy(() => import('./components/RoleCustomizedFunctionsModal').then(m => ({ default: m.RoleCustomizedFunctionsModal })));
const MultiUserActionSuiteTab = lazy(() => import('./components/MultiUserActionSuiteTab').then(m => ({ default: m.MultiUserActionSuiteTab })));
const CleanAirRouteNavigatorTab = lazy(() => import('./components/CleanAirRouteNavigatorTab').then(m => ({ default: m.CleanAirRouteNavigatorTab })));
const PlumeDispersionLabTab = lazy(() => import('./components/PlumeDispersionLabTab').then(m => ({ default: m.PlumeDispersionLabTab })));
const AQIHistoricalDataTab = lazy(() => import('./components/AQIHistoricalDataTab').then(m => ({ default: m.AQIHistoricalDataTab })));
const AtmosphericMLLabTab = lazy(() => import('./components/AtmosphericMLLabTab').then(m => ({ default: m.AtmosphericMLLabTab })));
const GeminiChatbotTab = lazy(() => import('./components/GeminiChatbotTab').then(m => ({ default: m.GeminiChatbotTab })));
const AtmosphericImageStudioTab = lazy(() => import('./components/AtmosphericImageStudioTab').then(m => ({ default: m.AtmosphericImageStudioTab })));
const AuthModal = lazy(() => import('./components/AuthModal').then(m => ({ default: m.AuthModal })));

import { 
  AQIMeasurement, 
  ForecastPoint, 
  GPSPosition, 
  OfflineMapRegion, 
  PolicyIntervention, 
  PolicySimulationResult, 
  SecurityAuditLog, 
  UserProfile, 
  UserRole,
  ThemeMode 
} from './types';
import { CITIES_AQI_DATA, MOCK_72H_FORECAST, INITIAL_USER_PROFILES, INITIAL_SECURITY_LOGS, INITIAL_OFFLINE_REGIONS } from './data/mockData';
import { apiFetch } from './services/api';
import { gpsTracker } from './services/gpsService';
import { offlineStorage } from './services/offlineStorageService';

export default function App() {
  const [activeTab, setActiveTab] = useState('map');
  const [selectedCityId, setSelectedCityId] = useState('delhi');
  const [isOffline, setIsOffline] = useState(offlineStorage.getForcedOffline());
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const savedTheme = localStorage.getItem('aurapredict_theme') as ThemeMode;
      return savedTheme === 'light' ? 'light' : 'slate';
    } catch {
      return 'slate';
    }
  });

  const handleToggleTheme = () => {
    const nextTheme: ThemeMode = theme === 'slate' ? 'light' : 'slate';
    setTheme(nextTheme);
    try {
      localStorage.setItem('aurapredict_theme', nextTheme);
    } catch (e) {
      console.warn('Could not persist theme', e);
    }
  };

  const [user, setUser] = useState<UserProfile>(INITIAL_USER_PROFILES[0]);
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>(INITIAL_SECURITY_LOGS);
  const [offlineRegions, setOfflineRegions] = useState<OfflineMapRegion[]>(INITIAL_OFFLINE_REGIONS);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [cityOverrides, setCityOverrides] = useState<Record<string, Partial<AQIMeasurement>>>({});
  const [deferredPrompt, setDeferredPrompt] = useState<any | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(() => {
    try {
      return window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    } catch {
      return false;
    }
  });

  // Capture native browser PWA install prompts
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowInstallModal(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
      setShowInstallModal(false);
    }
  };

  // Real-time GPS tracking state
  const [gpsPos, setGpsPos] = useState<GPSPosition | null>(null);
  const [gpsActive, setGpsActive] = useState(false);

  // Gemini AI Forecast & Policy Simulation states
  const [aiReportMarkdown, setAiReportMarkdown] = useState<string | null>(null);
  const [isLoadingForecastAI, setIsLoadingForecastAI] = useState(false);

  const [simulationResult, setSimulationResult] = useState<PolicySimulationResult | null>(null);
  const [isSimulatingPolicy, setIsSimulatingPolicy] = useState(false);

  const baseCityData: AQIMeasurement = CITIES_AQI_DATA.find(c => c.cityId === selectedCityId) || CITIES_AQI_DATA[0];
  const currentCityData: AQIMeasurement = {
    ...baseCityData,
    ...(cityOverrides[selectedCityId] || {}),
    weather: {
      ...baseCityData.weather,
      ...(cityOverrides[selectedCityId]?.weather || {})
    }
  };

  const handleApplyMLModel = (adjustment: {
    adjustedAQI: number;
    adjustedBoundaryLayerM: number;
    dispersionMultiplier: number;
    photochemicalOzoneShift: number;
    regimeName: string;
  }) => {
    setCityOverrides(prev => ({
      ...prev,
      [selectedCityId]: {
        ...(prev[selectedCityId] || {}),
        aqi: adjustment.adjustedAQI,
        weather: {
          ...currentCityData.weather,
          boundaryLayerHeightM: adjustment.adjustedBoundaryLayerM
        }
      }
    }));
  };

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
      const res = await apiFetch('/api/predict/forecast', {
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
      const res = await apiFetch('/api/policy/simulate', {
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
      const res = await apiFetch('/api/health/advisor', {
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

  // Update Profile
  const handleUpdateUser = (updatedFields: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updatedFields }));
  };

  return (
    <div className={`h-screen w-screen overflow-hidden flex flex-col ${theme === 'light' ? 'light-mode bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'} font-sans selection:bg-emerald-500 selection:text-slate-950 transition-colors duration-200`}>
      {/* Enterprise Top Navigation & Global Header Bar */}
      <HeaderBar
        selectedCity={selectedCityId}
        setSelectedCity={setSelectedCityId}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenRoleModal={() => setShowRoleModal(true)}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onOpenInstallModal={() => setShowInstallModal(true)}
        isInstalled={isInstalled}
        hasInstallPrompt={!!deferredPrompt}
        theme={theme}
        onToggleTheme={handleToggleTheme}
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
          onOpenInstallModal={() => setShowInstallModal(true)}
          isInstalled={isInstalled}
          hasInstallPrompt={!!deferredPrompt}
        />

        {/* Main Content View Container with Ambient AQI Logo Watermark Backdrop */}
        <main className="flex-1 h-full min-w-0 overflow-hidden p-3 md:p-5 flex flex-col relative">
          {/* Subtle Ambient AQI Logo Background Watermark */}
          <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
            <div className="w-[600px] h-[300px] md:w-[800px] md:h-[400px] opacity-[0.03] dark:opacity-[0.045] transform -rotate-6 transition-all duration-700">
              <AQILogo variant="watermark" className="w-full h-full" />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.995 }}
              transition={{ duration: 0.18, ease: [0.25, 1, 0.5, 1] }}
              className="w-full h-full min-h-0 flex-1 flex flex-col overflow-hidden relative z-10"
            >
              <ErrorBoundary 
                fallbackTitle={`${activeTab.replace('_', ' ').toUpperCase()} Tab Error`} 
                onReset={() => setActiveTab('map')}
              >
                <Suspense fallback={<TabLoadingSkeleton title={activeTab.replace('_', ' ').toUpperCase()} />}>
                  {activeTab === 'gemini_chat' && (
                  <div className="h-full overflow-y-auto pr-1.5 custom-scrollbar">
                    <GeminiChatbotTab
                      currentCityData={currentCityData}
                    />
                  </div>
                )}

                {activeTab === 'image_studio' && (
                  <div className="h-full overflow-y-auto pr-1.5 custom-scrollbar">
                    <AtmosphericImageStudioTab
                      currentCityData={currentCityData}
                    />
                  </div>
                )}

                {activeTab === 'route_nav' && (
                  <div className="h-full overflow-y-auto pr-1.5 custom-scrollbar">
                    <CleanAirRouteNavigatorTab
                      currentCityData={currentCityData}
                    />
                  </div>
                )}

                {activeTab === 'plume_lab' && (
                  <div className="h-full overflow-y-auto pr-1.5 custom-scrollbar">
                    <PlumeDispersionLabTab
                      currentCityData={currentCityData}
                    />
                  </div>
                )}

                {activeTab === 'multi_user' && (
                  <div className="h-full overflow-y-auto pr-1.5 custom-scrollbar">
                    <MultiUserActionSuiteTab
                      currentCityData={currentCityData}
                    />
                  </div>
                )}

                {activeTab === 'map' && (
                  <LiveMapTab
                    currentCityData={currentCityData}
                    gpsPos={gpsPos}
                    onDownloadOfflineRegion={handleDownloadOfflineRegion}
                    isOffline={isOffline}
                    onSelectCity={(id) => setSelectedCityId(id)}
                  />
                )}

                {activeTab === 'ml_lab' && (
                  <div className="h-full overflow-y-auto pr-1.5 custom-scrollbar">
                    <AtmosphericMLLabTab
                      currentCityData={currentCityData}
                      onApplyMLModel={handleApplyMLModel}
                    />
                  </div>
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

                {activeTab === 'historical' && (
                  <div className="h-full overflow-y-auto pr-1.5 custom-scrollbar">
                    <AQIHistoricalDataTab
                      currentCityData={currentCityData}
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
                    />
                  </div>
                )}
                </Suspense>
              </ErrorBoundary>
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Multi-User Role Customized Functions Modal */}
        {showRoleModal && (
          <Suspense fallback={null}>
            <RoleCustomizedFunctionsModal
              user={user}
              currentCityData={currentCityData}
              onRoleChange={handleRoleChange}
              onClose={() => setShowRoleModal(false)}
            />
          </Suspense>
        )}

        {/* Multi-Modal Biometric & OpenCV Facial Authentication Modal */}
        {showAuthModal && (
          <Suspense fallback={null}>
            <AuthModal
              isOpen={showAuthModal}
              onClose={() => setShowAuthModal(false)}
            />
          </Suspense>
        )}

        {/* PWA & Native App Installation Modal */}
        <AppInstallModal
          isOpen={showInstallModal}
          onClose={() => setShowInstallModal(false)}
          deferredPrompt={deferredPrompt}
          onNativeInstall={handleNativeInstall}
          isInstalled={isInstalled}
        />
    </div>
  </div>
);
}
