export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface StructuredLog {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  requestId?: string;
  data?: Record<string, any>;
  durationMs?: number;
}

class LoggerService {
  private formatLog(level: LogLevel, message: string, meta?: { context?: string; requestId?: string; data?: any; durationMs?: number }): StructuredLog {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: meta?.context,
      requestId: meta?.requestId,
      data: meta?.data,
      durationMs: meta?.durationMs
    };
  }

  public info(message: string, meta?: { context?: string; requestId?: string; data?: any; durationMs?: number }) {
    const log = this.formatLog('INFO', message, meta);
    console.log(`[${log.timestamp}] [INFO] ${log.context ? `[${log.context}] ` : ''}${log.message}`, log.data ? JSON.stringify(log.data) : '');
  }

  public warn(message: string, meta?: { context?: string; requestId?: string; data?: any; durationMs?: number }) {
    const log = this.formatLog('WARN', message, meta);
    console.warn(`[${log.timestamp}] [WARN] ${log.context ? `[${log.context}] ` : ''}${log.message}`, log.data ? JSON.stringify(log.data) : '');
  }

  public error(message: string, meta?: { context?: string; requestId?: string; data?: any; error?: any; durationMs?: number }) {
    const log = this.formatLog('ERROR', message, meta);
    console.error(`[${log.timestamp}] [ERROR] ${log.context ? `[${log.context}] ` : ''}${log.message}`, meta?.error || '', log.data ? JSON.stringify(log.data) : '');
  }

  public debug(message: string, meta?: { context?: string; requestId?: string; data?: any; durationMs?: number }) {
    if (process.env.DEBUG || process.env.NODE_ENV !== 'production') {
      const log = this.formatLog('DEBUG', message, meta);
      console.debug(`[${log.timestamp}] [DEBUG] ${log.context ? `[${log.context}] ` : ''}${log.message}`, log.data ? JSON.stringify(log.data) : '');
    }
  }
}

export const logger = new LoggerService();
