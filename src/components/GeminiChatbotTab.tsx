import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  BrainCircuit, 
  Zap, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  User, 
  Layers, 
  ShieldAlert, 
  Atom, 
  Stethoscope, 
  Globe2, 
  FileSpreadsheet, 
  Flame, 
  Radio, 
  Clock, 
  Activity,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { AQIMeasurement } from '../types';
import { AQILogo } from './AQILogo';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  modelUsed?: string;
  isThinking?: boolean;
  thinkingApplied?: boolean;
}

interface GeminiChatbotTabProps {
  currentCityData: AQIMeasurement;
}

export const GeminiChatbotTab: React.FC<GeminiChatbotTabProps> = ({ currentCityData }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am **AuraPredict Atmospheric Intelligence**. I can analyze complex photochemical air quality dynamics, simulate exposure risks, model transboundary dispersion plumes, or provide instant micro-sensor triage for **${currentCityData.cityName}** (Current AQI: **${currentCityData.aqi}**). \n\nFeel free to ask a question, select an expert persona, activate **High Thinking Mode**, or click the microphone to transcribe your voice directly!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.7-flash'
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'chemist' | 'epidemiologist' | 'gis' | 'policy' | 'triage'>('chemist');
  const [enableHighThinking, setEnableHighThinking] = useState(false);
  const [lowLatency, setLowLatency] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'gemini-3.1-pro-preview' | 'gemini-3.5-flash' | 'gemini-3.1-flash-lite' | 'gemini-3.7-flash'>('gemini-3.7-flash');

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Adjust model when toggles change
  useEffect(() => {
    if (enableHighThinking) {
      setSelectedModel('gemini-3.1-pro-preview');
      setLowLatency(false);
    } else if (lowLatency || selectedRole === 'triage') {
      setSelectedModel('gemini-3.1-flash-lite');
      setEnableHighThinking(false);
    }
  }, [enableHighThinking, lowLatency, selectedRole]);

  // Quick Prompt Suggestions
  const rolePrompts = {
    chemist: [
      `Derive the photochemical equilibrium between O3, NO, and NO2 under intense solar actinic flux for ${currentCityData.cityName}.`,
      `Explain the VOC-limited vs NOx-limited ozone sensitivity regime given PM2.5 of ${currentCityData.pm25} µg/m³.`,
      `What chemical oxidation pathways convert SO2 to secondary ammonium sulfate aerosols in winter smog?`
    ],
    epidemiologist: [
      `What is the alveolar deposition fraction of PM2.5 at ${currentCityData.pm25} µg/m³ during moderate aerobic exertion?`,
      `Compare the fractional filtration efficiency of N95 vs standard surgical masks for wildfire smoke micro-particles.`,
      `Provide clinical guidance for asthmatic patients in ${currentCityData.cityName} with current AQI ${currentCityData.aqi}.`
    ],
    gis: [
      `How does Sentinel-5P TROPOMI tropospheric NO2 column correlate with ground-level IoT monitoring stations?`,
      `Explain Spatio-Temporal Graph Neural Network (ST-GNN) message passing for irregular air quality sensor topologies.`,
      `Describe the boundary layer height (PBLH) parameterization during nocturnal ground temperature inversions.`
    ],
    policy: [
      `What is the projected cost-benefit ratio of an Odd-Even traffic rationing decree vs industrial scrubber mandates?`,
      `Simulate an industrial curtailment of 35% in heavy manufacturing zones around ${currentCityData.cityName}.`,
      `How do targeted bio-decomposer subsidies mitigate transboundary agricultural stubble burning plumes?`
    ],
    triage: [
      `Instant risk summary for ${currentCityData.cityName} AQI ${currentCityData.aqi}.`,
      `Is it safe for outdoor marathon training today?`,
      `Indoor HEPA purifier runtime recommendation for current PM2.5 level.`
    ]
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputPrompt;
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          role: selectedRole,
          model: selectedModel,
          enableHighThinking,
          lowLatency
        })
      });

      const data = await response.json();
      const assistantMessage: Message = {
        id: `ast_${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Analysis completed.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed || selectedModel,
        thinkingApplied: data.thinkingApplied
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      const fallbackMessage: Message = {
        id: `ast_err_${Date.now()}`,
        role: 'assistant',
        content: `**[Atmospheric Fallback Assessment]**\n\nAtmospheric dynamics for **${currentCityData.cityName}** indicate active boundary layer stagnation. Recommended mitigation: activate indoor HEPA filtration and limit prolonged strenuous outdoor exercise during peak inversion hours.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'aura-physics-fallback'
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Audio Recording & Transcription
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        // Clean up audio tracks
        stream.getTracks().forEach(track => track.stop());
        await transcribeAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone access error:', err);
      alert('Microphone access is required for voice transcription. Please grant audio permissions in your browser.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const transcribeAudio = async (blob: Blob) => {
    setIsTranscribing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        const response = await fetch('/api/gemini/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioBase64: base64Data,
            mimeType: 'audio/webm'
          })
        });

        const data = await response.json();
        if (data.transcript) {
          setInputPrompt(data.transcript);
        }
        setIsTranscribing(false);
      };
    } catch (error) {
      console.error('Transcription error:', error);
      setIsTranscribing(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const speakText = (text: string, id: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown symbols for cleaner speech
    const cleanText = text.replace(/[*_#`[\]()]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    
    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        {/* Subtle Watermark in Card */}
        <div className="absolute -right-8 -bottom-8 w-44 h-44 opacity-5 pointer-events-none">
          <AQILogo variant="watermark" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <AQILogo variant="icon-only" iconClassName="w-11 h-11" />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                  <span>Gemini Atmospheric Intelligence & Chatbot</span>
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Multi-Turn Agent
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Multi-model atmospheric reasoning, photochemical kinetics analysis, voice transcription & instant triage
              </p>
            </div>
          </div>

          {/* Model & Mode Indicators */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Thinking Mode Toggle */}
            <button
              onClick={() => {
                setEnableHighThinking(!enableHighThinking);
                if (!enableHighThinking) setLowLatency(false);
              }}
              className={`px-3 py-1.5 rounded-lg border font-medium flex items-center space-x-1.5 transition-all ${
                enableHighThinking
                  ? 'bg-purple-600/20 text-purple-300 border-purple-500/50 shadow-sm shadow-purple-500/20'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />
              <span>High Thinking ({enableHighThinking ? 'ON' : 'OFF'})</span>
            </button>

            {/* Low-Latency Mode Toggle */}
            <button
              onClick={() => {
                setLowLatency(!lowLatency);
                if (!lowLatency) setEnableHighThinking(false);
              }}
              className={`px-3 py-1.5 rounded-lg border font-medium flex items-center space-x-1.5 transition-all ${
                lowLatency
                  ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Low-Latency ({lowLatency ? 'ON' : 'OFF'})</span>
            </button>

            {/* Reset Chat */}
            <button
              onClick={() => setMessages([
                {
                  id: 'reset',
                  role: 'assistant',
                  content: `Conversation refreshed. How may I assist your atmospheric analysis for **${currentCityData.cityName}**?`,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  modelUsed: selectedModel
                }
              ])}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200 hover:bg-slate-700 transition-colors flex items-center space-x-1"
              title="Clear Thread"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Persona Selector Tabs */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold mr-1 flex items-center space-x-1">
            <Atom className="w-3.5 h-3.5 text-cyan-400" />
            <span>Expert Persona:</span>
          </span>

          {[
            { id: 'chemist', label: 'Atmospheric Chemist', icon: Atom, model: 'gemini-3.1-pro-preview' },
            { id: 'epidemiologist', label: 'Health & Epidemiologist', icon: Stethoscope, model: 'gemini-3.5-flash' },
            { id: 'gis', label: 'GIS & Remote Sensing', icon: Globe2, model: 'gemini-3.5-flash' },
            { id: 'policy', label: 'Policy Strategist', icon: FileSpreadsheet, model: 'gemini-3.1-pro-preview' },
            { id: 'triage', label: 'Instant Sensor Triage', icon: Zap, model: 'gemini-3.1-flash-lite' }
          ].map(p => {
            const Icon = p.icon;
            const isActive = selectedRole === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedRole(p.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'bg-slate-800/60 text-slate-400 border border-slate-700/50 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chat Thread */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-2xl shadow-xl flex flex-col h-[560px] overflow-hidden">
        {/* Messages Container */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                    isUser
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-800 border border-slate-700 text-cyan-400'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[82%] rounded-2xl p-4 text-sm leading-relaxed space-y-2 ${
                    isUser
                      ? 'bg-cyan-600/90 text-white rounded-tr-none shadow-md'
                      : 'bg-slate-800/90 border border-slate-700/70 text-slate-100 rounded-tl-none shadow-lg'
                  }`}
                >
                  {/* Meta tag / Header */}
                  <div className="flex items-center justify-between text-[11px] pb-1 border-b border-white/10 dark:border-slate-700/50">
                    <span className="font-semibold text-slate-300">
                      {isUser ? 'You' : 'AuraPredict AI'}
                    </span>
                    <div className="flex items-center space-x-2 text-slate-400">
                      {m.modelUsed && (
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-900/60 text-cyan-300">
                          {m.modelUsed}
                        </span>
                      )}
                      <span>{m.timestamp}</span>
                    </div>
                  </div>

                  {/* Body Text */}
                  <div className="whitespace-pre-wrap font-sans text-[13.5px] leading-relaxed">
                    {m.content}
                  </div>

                  {/* Assistant Footer Actions */}
                  {!isUser && (
                    <div className="pt-2 flex items-center justify-end space-x-2 text-xs text-slate-400">
                      <button
                        onClick={() => copyToClipboard(m.content, m.id)}
                        className="p-1 rounded hover:bg-slate-700/60 hover:text-slate-200 transition-colors flex items-center space-x-1"
                        title="Copy message"
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-[10px] text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-[10px]">Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => speakText(m.content, m.id)}
                        className="p-1 rounded hover:bg-slate-700/60 hover:text-slate-200 transition-colors flex items-center space-x-1"
                        title="Read Aloud"
                      >
                        {speakingId === m.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                            <span className="text-[10px] text-amber-400">Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span className="text-[10px]">Speak</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading Bubble */}
          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-cyan-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
              </div>
              <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-none p-4 text-xs text-slate-300 flex items-center space-x-3 shadow-md">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span>
                  {enableHighThinking
                    ? 'Executing high-reasoning atmospheric chemical & dispersion derivation...'
                    : 'Synthesizing atmospheric telemetry & predictive models...'}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center space-x-2 overflow-x-auto text-xs no-scrollbar">
          <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Suggested:</span>
          </span>
          {rolePrompts[selectedRole]?.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60 hover:bg-slate-700 hover:text-cyan-300 text-[11px] whitespace-nowrap transition-colors"
            >
              {prompt.length > 55 ? prompt.slice(0, 55) + '...' : prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col space-y-2">
          {isRecording && (
            <div className="flex items-center justify-between px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                <span className="font-semibold">Recording Voice Input: {recordingTime}s</span>
              </div>
              <button
                onClick={stopRecording}
                className="font-bold underline hover:text-red-300"
              >
                Finish & Transcribe
              </button>
            </div>
          )}

          {isTranscribing && (
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 text-xs">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Transcribing audio with Gemini 3.5 Flash...</span>
            </div>
          )}

          <div className="flex items-center space-x-2">
            {/* Microphone Transcription Button */}
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-3 rounded-xl border transition-all flex items-center justify-center shrink-0 ${
                isRecording
                  ? 'bg-red-600 text-white border-red-500 animate-pulse'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-cyan-400'
              }`}
              title={isRecording ? 'Stop Recording' : 'Dictate with Microphone (Transcribe Audio)'}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Text Input Box */}
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={`Ask Gemini Atmospheric Intelligence about ${currentCityData.cityName} air quality, photochemistry, or policies...`}
              disabled={isLoading}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all disabled:opacity-50"
            />

            {/* Send Button */}
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!inputPrompt.trim() || isLoading}
              className="p-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:hover:bg-cyan-600 text-white rounded-xl font-semibold transition-all flex items-center justify-center shrink-0 shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
