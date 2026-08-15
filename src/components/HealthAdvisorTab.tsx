import React, { useState, useEffect } from 'react';
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
  Activity,
  Download,
  Volume2,
  Square,
  FileText,
  Printer,
  FileCode,
  Share2
} from 'lucide-react';
import { AQIMeasurement, UserProfile, AIChatMessage } from '../types';
import { reportExportService, ReportFormat } from '../services/reportExportService';
import { speechSynthesisService } from '../services/speechSynthesisService';

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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
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

  useEffect(() => {
    const unsub = speechSynthesisService.subscribeSpeaking((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => unsub();
  }, []);

  const handleReadAloudAdvisory = () => {
    if (isSpeaking) {
      speechSynthesisService.stop();
      return;
    }

    const latestAssistantMsg = [...chatMessages].reverse().find(m => m.sender === 'assistant')?.text || 
      `AQI in ${currentCityData.cityName} is ${currentCityData.aqi}. Please exercise caution.`;

    const script = speechSynthesisService.generateHealthAdvisorySpeech(
      currentCityData.cityName,
      currentCityData.aqi,
      currentCityData.aqiCategory,
      user.healthConditions,
      latestAssistantMsg
    );

    speechSynthesisService.speak(script);
  };

  const handleExport = (format: ReportFormat) => {
    const latestAdvice = [...chatMessages].reverse().find(m => m.sender === 'assistant')?.text || 
      'Patients should maintain indoor HEPA air filtration and avoid strenuous outdoor exercise.';
    
    reportExportService.exportHealthBriefing(user, currentCityData, latestAdvice, format);
    setShowExportModal(false);
  };

  const availableConditions = [
    { id: 'asthma', label: 'Asthma / Bronchitis' },
    { id: 'copd', label: 'COPD / Chronic Respiratory' },
    { id: 'cardiovascular', label: 'Cardiovascular Condition' },
    { id: 'pregnant', label: 'Maternal / Pregnancy' },
    { id: 'elderly', label: 'Elderly (>65 yrs)' },
    { id: 'child', label: 'Pediatric / Child (<12 yrs)' },
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
      {/* Top Banner with Voice & Export Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
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

        <div className="flex items-center space-x-2">
          {/* Read Aloud Voice Button */}
          <button
            onClick={handleReadAloudAdvisory}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
              isSpeaking
                ? 'bg-red-500/20 border-red-500/40 text-red-300 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title="Read health guidance aloud using SpeechSynthesis API"
          >
            {isSpeaking ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isSpeaking ? 'Stop Speaking' : 'Read Aloud'}</span>
          </button>

          {/* Export Health Report Button */}
          <button
            onClick={() => setShowExportModal(true)}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Briefing</span>
          </button>
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
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-1 disabled:opacity-50 transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>

      {/* Export Health Briefing Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Download className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-base text-slate-100">Export Health Advisory Briefing</h3>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Download your personalized respiratory exposure report, doctor's recommendations, and speciated toxicant analysis for <strong className="text-slate-200">{currentCityData.cityName}</strong>.
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => handleExport('html_print')}
                className="w-full p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-between transition-all group cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg group-hover:bg-emerald-500/20">
                    <Printer className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-100">Printable PDF Dossier (HTML)</div>
                    <div className="text-[10px] text-slate-400">Clean formatted medical report ready for print or saving as PDF</div>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">&rarr;</span>
              </button>

              <button
                onClick={() => handleExport('markdown')}
                className="w-full p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-between transition-all group cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-sky-500/10 text-sky-400 rounded-lg group-hover:bg-sky-500/20">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-100">Markdown Document (.md)</div>
                    <div className="text-[10px] text-slate-400">Structured markdown with pollutant tables and clinical notes</div>
                  </div>
                </div>
                <span className="text-[10px] text-sky-400 font-bold">&rarr;</span>
              </button>

              <button
                onClick={() => handleExport('json')}
                className="w-full p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-between transition-all group cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg group-hover:bg-amber-500/20">
                    <FileCode className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-100">JSON Data Object (.json)</div>
                    <div className="text-[10px] text-slate-400">Machine-readable payload with full exposure analytics</div>
                  </div>
                </div>
                <span className="text-[10px] text-amber-400 font-bold">&rarr;</span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
