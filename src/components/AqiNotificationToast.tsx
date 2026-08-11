import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  X, 
  BellRing, 
  ShieldAlert, 
  HeartPulse, 
  Navigation, 
  Check, 
  Volume2, 
  VolumeX, 
  Sparkles,
  ChevronRight,
  Bell
} from 'lucide-react';
import { AQIMeasurement } from '../types';

interface AqiNotificationToastProps {
  currentCityData: AQIMeasurement;
  alertThreshold: number;
  onNavigateTab: (tab: string) => void;
  healthConditions: string[];
}

export interface AQIAlert {
  id: string;
  cityName: string;
  aqi: number;
  category: string;
  primaryPollutant: string;
  timestamp: string;
  read: boolean;
  severity: 'high' | 'critical' | 'moderate';
}

export const AqiNotificationToast: React.FC<AqiNotificationToastProps> = ({
  currentCityData,
  alertThreshold,
  onNavigateTab,
  healthConditions
}) => {
  const [activeAlert, setActiveAlert] = useState<AQIAlert | null>(null);
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [alertHistory, setAlertHistory] = useState<AQIAlert[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Request native browser notifications permission
  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const res = await Notification.requestPermission();
        setBrowserPermission(res);
        if (res === 'granted') {
          new Notification('AuraPredict AI Notifications Enabled', {
            body: `Monitoring AQI threshold set at ${alertThreshold} AQI for ${currentCityData.cityName}.`,
            icon: '/favicon.ico'
          });
        }
      } catch (err) {
        console.error('Browser Notification error:', err);
      }
    }
  };

  // Trigger alert logic
  const triggerAlert = (cityData: AQIMeasurement, customReason?: string) => {
    if (isMuted) return;

    const isHigh = cityData.aqi >= alertThreshold || ['Unhealthy', 'Very Unhealthy', 'Hazardous'].includes(cityData.aqiCategory);
    
    if (isHigh) {
      const severity = cityData.aqi > 250 ? 'critical' : cityData.aqi > 180 ? 'high' : 'moderate';
      const newAlert: AQIAlert = {
        id: Date.now().toString(),
        cityName: cityData.cityName,
        aqi: cityData.aqi,
        category: cityData.aqiCategory,
        primaryPollutant: cityData.primaryPollutant,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
        severity
      };

      setActiveAlert(newAlert);
      setAlertHistory(prev => [newAlert, ...prev.slice(0, 9)]);

      // Audio alert beep simulation using Web Audio API if sound enabled
      if (soundEnabled) {
        try {
          const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(severity === 'critical' ? 880 : 587.33, ctx.currentTime); // A5 or D5
          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.4);
        } catch {
          // AudioContext not allowed without user gesture
        }
      }

      // Desktop Native Notification
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(`AQI ALERT: ${cityData.cityName} (${cityData.aqi} AQI)`, {
          body: customReason || `Air quality has entered ${cityData.aqiCategory} status. Dominant pollutant: ${cityData.primaryPollutant}.`,
          tag: 'aqi-alert'
        });
      }
    }
  };

  // Monitor city changes and threshold crossings
  useEffect(() => {
    if (currentCityData.aqi >= alertThreshold || ['Unhealthy', 'Very Unhealthy', 'Hazardous'].includes(currentCityData.aqiCategory)) {
      triggerAlert(currentCityData);
    }
  }, [currentCityData.cityId, currentCityData.aqi, alertThreshold]);

  const handleSimulateSpike = () => {
    const spikedData: AQIMeasurement = {
      ...currentCityData,
      aqi: Math.max(currentCityData.aqi + 45, 265),
      aqiCategory: 'Very Unhealthy'
    };
    triggerAlert(spikedData, 'Simulated atmospheric surge detected! PM2.5 spike above safe threshold.');
  };

  return (
    <>
      {/* Top Header Floating Control / Alert Badge Pill */}
      <div className="fixed top-3 right-4 z-50 flex items-center space-x-2">
        {/* Test Alert Spike Button & History Button */}
        <button
          onClick={handleSimulateSpike}
          className="px-2.5 py-1 bg-slate-900/90 backdrop-blur-md hover:bg-slate-800 text-amber-400 hover:text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-lg transition-all"
          title="Trigger a real-time AQI spike alert test"
        >
          <BellRing className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="hidden sm:inline">Test AQI Alert</span>
        </button>

        <button
          onClick={() => setShowHistoryModal(!showHistoryModal)}
          className="relative p-1.5 bg-slate-900/90 backdrop-blur-md hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg shadow-lg transition-colors"
          title="Alert History & Settings"
        >
          <Bell className="w-4 h-4 text-emerald-400" />
          {alertHistory.filter(a => !a.read).length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center animate-bounce">
              {alertHistory.filter(a => !a.read).length}
            </span>
          )}
        </button>
      </div>

      {/* Active Toast Alert Dialog */}
      {activeAlert && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-slate-900/95 backdrop-blur-xl border border-red-500/40 rounded-2xl p-4 shadow-2xl shadow-red-950/40 text-slate-100 animate-slide-up transition-all space-y-3">
          <div className="flex items-start justify-between border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center space-x-2.5">
              <div className={`p-2 rounded-xl flex items-center justify-center ${
                activeAlert.severity === 'critical' 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse' 
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              }`}>
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wide">
                    {activeAlert.severity === 'critical' ? 'HAZARDOUS AIR SURGE' : 'AQI THRESHOLD EXCEEDED'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{activeAlert.timestamp}</span>
                </div>
                <h4 className="font-extrabold text-sm text-slate-100">{activeAlert.cityName} reached AQI {activeAlert.aqi}</h4>
              </div>
            </div>

            <button
              onClick={() => setActiveAlert(null)}
              className="text-slate-400 hover:text-slate-100 p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Concentration of <span className="font-bold text-emerald-400">{activeAlert.primaryPollutant}</span> exceeds user threshold ({alertThreshold} AQI). Status: <span className="text-red-400 font-semibold">{activeAlert.category}</span>.
          </p>

          {healthConditions.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-2.5 text-[11px] text-red-300 flex items-start space-x-2">
              <HeartPulse className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Personalized Vulnerability Warning:</span> Sensitive health profiles ({healthConditions.join(', ')}) should wear N95 mask and limit outdoor exertion.
              </div>
            </div>
          )}

          {/* Toast Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                onNavigateTab('navigation');
                setActiveAlert(null);
              }}
              className="py-2 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold rounded-xl text-xs flex items-center justify-center space-x-1 transition-all shadow-md shadow-emerald-600/20"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Clean Route</span>
            </button>

            <button
              onClick={() => {
                onNavigateTab('health');
                setActiveAlert(null);
              }}
              className="py-2 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center space-x-1 border border-slate-700 transition-colors"
            >
              <HeartPulse className="w-3.5 h-3.5 text-red-400" />
              <span>Health Guide</span>
            </button>
          </div>

          {/* Browser Notification Enable CTA if default */}
          {browserPermission === 'default' && (
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Receive desktop push alerts?</span>
              <button
                onClick={requestNotificationPermission}
                className="text-emerald-400 font-bold hover:underline flex items-center space-x-1"
              >
                <span>Enable Desktop Push</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Notification History & Control Drawer */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-base text-slate-100">AQI Notification Center</h3>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification Controls */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">Desktop Push Notifications</span>
                {browserPermission === 'granted' ? (
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded">Granted</span>
                ) : (
                  <button
                    onClick={requestNotificationPermission}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-[11px] rounded transition-colors"
                  >
                    Enable
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-slate-800/80 pt-2">
                <span className="text-slate-300 font-medium">Alert Audio Beep</span>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`p-1.5 rounded-lg border text-xs font-bold flex items-center space-x-1 ${
                    soundEnabled ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{soundEnabled ? 'On' : 'Muted'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800/80 pt-2">
                <span className="text-slate-300 font-medium">Current Alert Threshold</span>
                <span className="font-mono font-bold text-amber-400">{alertThreshold} AQI</span>
              </div>
            </div>

            {/* History List */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Alert Logs</h4>
              {alertHistory.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs">
                  No AQI threshold breach alerts recorded in this session.
                </div>
              ) : (
                alertHistory.map((alert) => (
                  <div 
                    key={alert.id}
                    className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      <div>
                        <div className="font-bold text-slate-200">{alert.cityName} &bull; AQI {alert.aqi}</div>
                        <div className="text-[10px] text-slate-400">{alert.category} &bull; {alert.timestamp}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onNavigateTab('map');
                        setShowHistoryModal(false);
                      }}
                      className="text-emerald-400 hover:underline text-[11px] font-semibold"
                    >
                      View Map
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
