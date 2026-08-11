import React, { useState } from 'react';
import { 
  HeartPulse, 
  ShieldAlert, 
  MessageSquare, 
  Sparkles, 
  Send, 
  AlertCircle, 
  Bell, 
  Check, 
  UserCheck, 
  Info,
  Activity
} from 'lucide-react';
import { AQIMeasurement, UserProfile, AIChatMessage } from '../types';

interface HealthAdvisorTabProps {
  currentCityData: AQIMeasurement;
  user: UserProfile;
  onUpdateUserHealth: (conditions: any[]) => void;
  onSendAIChat: (message: string) => Promise<string>;
}

export const HealthAdvisorTab: React.FC<HealthAdvisorTabProps> = ({
  currentCityData,
  user,
  onUpdateUserHealth,
  onSendAIChat
}) => {
  const [chatInput, setChatInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [chatMessages, setChatMessages] = useState<AIChatMessage[]>([
    {
      id: 'msg_1',
      sender: 'assistant',
      text: `Hello ${user?.name || 'User'}. I am your AuraPredict AI Health Assistant. Current AQI at ${currentCityData?.cityName || 'your city'} is ${currentCityData?.aqi || 50} (${currentCityData?.aqiCategory || 'Moderate'}). Given your health profile (${(user?.healthConditions || []).join(', ') || 'General Public'}), how can I assist you with outdoor exposure limits or mask guidance today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [alertThreshold, setAlertThreshold] = useState(user.alertThresholdAQI || 120);
  const [isSavedAlert, setIsSavedAlert] = useState(false);

  const availableConditions = [
    { id: 'asthma', label: 'Asthma / Bronchitis' },
    { id: 'copd', label: 'COPD / Chronic Respiratory' },
    { id: 'cardiovascular', label: 'Cardiovascular Condition' },
    { id: 'pregnant', label: 'Maternal / Pregnancy' },
    { id: 'elderly', label: 'Elderly (&gt;65 yrs)' },
    { id: 'child', label: 'Pediatric / Child (&lt;12 yrs)' },
    { id: 'outdoor_worker', label: 'Outdoor Field Worker' },
    { id: 'athlete', label: 'Outdoor Endurance Athlete' }
  ];

  const handleToggleCondition = (condId: any) => {
    let updated = [...(user?.healthConditions || [])];
    if (updated.includes(condId)) {
      updated = updated.filter(c => c !== condId);
    } else {
      updated.push(condId);
    }
    onUpdateUserHealth(updated);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isSending) return;

    const userText = chatInput.trim();
    setChatInput('');

    const userMsg: AIChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsSending(true);

    try {
      const responseText = await onSendAIChat(userText);
      const aiMsg: AIChatMessage = {
        id: `msg_ai_${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errMsg: AIChatMessage = {
        id: `msg_err_${Date.now()}`,
        sender: 'assistant',
        text: 'Sorry, I encountered an issue retrieving health advice. Please ensure indoor HEPA purifiers are running if AQI is high.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, errMsg]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">Personal Health Advisory & Risk Monitor</h2>
            <p className="text-xs text-slate-400">
              Personalized medical exposure guidance tailored to respiratory sensitivities and active AQI levels
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400">Active Exposure Risk:</span>
          <span className={`px-2.5 py-1 rounded font-bold ${
            currentCityData.aqi > 200 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-300'
          }`}>
            {currentCityData.aqi > 200 ? 'Severe Exposure Hazard' : 'Moderate Caution'}
          </span>
        </div>
      </div>

      {/* Main Grid: Health Profile Config & Gemini AI Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Conditions Config Panel */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>Health Profile Sensitivities</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Toggle conditions to customize AI health warnings
              </p>
            </div>

            <div className="space-y-2">
              {availableConditions.map((cond) => {
                const isSelected = user.healthConditions.includes(cond.id as any);
                return (
                  <button
                    key={cond.id}
                    onClick={() => handleToggleCondition(cond.id)}
                    className={`w-full p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                      isSelected 
                        ? 'bg-emerald-500/15 border-emerald-500/50 text-slate-100' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{cond.label}</span>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                      isSelected ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-700'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Alert Threshold Setup */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
            <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
                <Bell className="w-4 h-4 text-amber-400" />
                <span>Custom Alert Trigger</span>
              </h3>
            </div>

            <p className="text-xs text-slate-400">Trigger push notifications if district AQI breaches threshold:</p>

            <div className="flex items-center space-x-3">
              <input
                type="range"
                min={50}
                max={300}
                step={10}
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <span className="font-mono font-bold text-sm text-amber-400 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
                AQI {alertThreshold}
              </span>
            </div>

            <button
              onClick={() => {
                setIsSavedAlert(true);
                setTimeout(() => setIsSavedAlert(false), 3000);
              }}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-colors"
            >
              {isSavedAlert ? 'Alert Threshold Saved!' : 'Save Notification Threshold'}
            </button>
          </div>
        </div>

        {/* Interactive Gemini AI Health Assistant Chat */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between min-h-[520px]">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-slate-100">Gemini Medical-Environmental Assistant</h3>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded font-bold">
                Live AI
              </span>
            </div>

            {/* Chat Thread */}
            <div className="space-y-3 mt-4 max-h-[380px] overflow-y-auto pr-1">
              {chatMessages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs space-y-1 ${
                      isUser 
                        ? 'bg-emerald-600 text-slate-950 font-medium' 
                        : 'bg-slate-950 border border-slate-800 text-slate-200'
                    }`}>
                      <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                      <span className={`text-[9px] block text-right font-mono ${
                        isUser ? 'text-slate-900' : 'text-slate-500'
                      }`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {isSending && (
                <div className="flex justify-start">
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-slate-400 flex items-center space-x-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                    <span>Gemini is generating personalized exposure advice...</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-800 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Ask a health question (e.g. Is it safe to jog outdoors at 6 PM?)..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={isSending || !chatInput.trim()}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-1 disabled:opacity-50 transition-all shadow-md shadow-emerald-600/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
