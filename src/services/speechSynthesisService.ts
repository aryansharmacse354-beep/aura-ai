// SpeechSynthesis Service for Audio AQI Alerts & Health Voice Broadcasts

export interface SpeechVoiceSettings {
  enabled: boolean;
  autoSpeakOnAlert: boolean;
  rate: number; // 0.5 to 2.0 (default 1.0)
  pitch: number; // 0.5 to 1.5 (default 1.0)
  volume: number; // 0 to 1.0 (default 1.0)
  voiceURI: string | null;
}

const SETTINGS_KEY = 'aurapredict_speech_settings';

const DEFAULT_SETTINGS: SpeechVoiceSettings = {
  enabled: true,
  autoSpeakOnAlert: true,
  rate: 1.0,
  pitch: 1.0,
  volume: 1.0,
  voiceURI: null
};

class SpeechSynthesisService {
  private isSupported: boolean;
  private settings: SpeechVoiceSettings;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private listeners: Set<(speaking: boolean) => void> = new Set();
  private isSpeakingState: boolean = false;

  constructor() {
    this.isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
    this.settings = this.loadSettings();
  }

  public checkSupport(): boolean {
    return this.isSupported;
  }

  public getSettings(): SpeechVoiceSettings {
    return { ...this.settings };
  }

  public updateSettings(newSettings: Partial<SpeechVoiceSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
      } catch (e) {
        console.error('Failed to persist speech settings', e);
      }
    }
  }

  private loadSettings(): SpeechVoiceSettings {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to load speech settings', e);
    }
    return DEFAULT_SETTINGS;
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (!this.isSupported) return [];
    return window.speechSynthesis.getVoices();
  }

  public subscribeSpeaking(callback: (speaking: boolean) => void): () => void {
    this.listeners.add(callback);
    callback(this.isSpeakingState);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifySpeaking(speaking: boolean) {
    this.isSpeakingState = speaking;
    this.listeners.forEach((fn) => fn(speaking));
  }

  public stop(): void {
    if (!this.isSupported) return;
    try {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
      this.notifySpeaking(false);
    } catch (e) {
      console.error('Error stopping speech synthesis', e);
    }
  }

  public speak(
    text: string,
    options?: {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
      rate?: number;
      pitch?: number;
      volume?: number;
    }
  ): boolean {
    if (!this.isSupported || !this.settings.enabled || !text.trim()) {
      return false;
    }

    try {
      // Cancel any ongoing speech first
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;

      const rate = options?.rate ?? this.settings.rate;
      const pitch = options?.pitch ?? this.settings.pitch;
      const volume = options?.volume ?? this.settings.volume;

      utterance.rate = Math.max(0.5, Math.min(2, rate));
      utterance.pitch = Math.max(0.5, Math.min(1.5, pitch));
      utterance.volume = Math.max(0, Math.min(1, volume));

      // Select configured voice or natural English fallback
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        if (this.settings.voiceURI) {
          const selected = voices.find((v) => v.voiceURI === this.settings.voiceURI);
          if (selected) utterance.voice = selected;
        } else {
          // Prefer natural English voices
          const preferred = voices.find(
            (v) => (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.lang.startsWith('en')) && v.lang.includes('en')
          );
          if (preferred) utterance.voice = preferred;
        }
      }

      utterance.onstart = () => {
        this.notifySpeaking(true);
        options?.onStart?.();
      };

      utterance.onend = () => {
        this.notifySpeaking(false);
        this.currentUtterance = null;
        options?.onEnd?.();
      };

      utterance.onerror = (e) => {
        this.notifySpeaking(false);
        this.currentUtterance = null;
        options?.onError?.(e);
      };

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (err) {
      console.error('SpeechSynthesis speak error:', err);
      this.notifySpeaking(false);
      return false;
    }
  }

  /**
   * Helper to construct natural speech alert for AQI threshold breach
   */
  public generateAQIAlertSpeech(
    cityName: string,
    aqi: number,
    category: string,
    primaryPollutant: string,
    healthConditions: string[] = []
  ): string {
    let text = `Attention. Air quality alert for ${cityName}. The current Air Quality Index has reached ${aqi}, entering ${category} category. The primary pollutant is ${primaryPollutant}. `;

    if (aqi >= 250) {
      text += 'Hazardous atmospheric condition detected. Everyone should avoid all outdoor physical activity, seal windows, and operate indoor HEPA purifiers. ';
    } else if (aqi >= 180) {
      text += 'Unhealthy air surge in progress. Sensitive individuals and outdoor workers must wear a fitted N95 respirator and limit outdoor exposure. ';
    } else if (aqi >= 120) {
      text += 'Air quality is elevated. Sensitive groups should reduce prolonged outdoor exertion. ';
    }

    if (healthConditions.length > 0) {
      const condNames = healthConditions.map((c) => c.replace('_', ' ')).join(', ');
      text += `Special caution is advised for individuals with ${condNames}.`;
    }

    return text;
  }

  /**
   * Helper to construct natural speech for health guidance briefing
   */
  public generateHealthAdvisorySpeech(
    cityName: string,
    aqi: number,
    category: string,
    healthConditions: string[],
    recommendationSummary: string
  ): string {
    let text = `Health briefing for ${cityName}. Current AQI is ${aqi}, classified as ${category}. `;
    if (healthConditions.length > 0) {
      text += `Customized for patient sensitivities: ${healthConditions.join(', ')}. `;
    }
    text += recommendationSummary;
    return text;
  }
}

export const speechSynthesisService = new SpeechSynthesisService();
