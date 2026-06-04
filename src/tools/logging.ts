type LogLevel = "debug" | "info" | "warn" | "error";

class Logger {
  private level: LogLevel = (process.env.LOG_LEVEL as LogLevel) || "info";

  private levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  private shouldLog(level: LogLevel): boolean {
    return this.levels[level] >= this.levels[this.level];
  }

  private formatMessage(level: LogLevel, prefix: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${prefix} ${message}`;
  }

  logDebug(prefix: string, message: string) {
    if (this.shouldLog("debug")) console.debug(this.formatMessage("debug", prefix, message));
  }

  logInfo(prefix: string, message: string) {
    if (this.shouldLog("info")) console.info(this.formatMessage("info", prefix, message));
  }

  logWarn(prefix: string, message: string) {
    if (this.shouldLog("warn")) console.warn(this.formatMessage("warn", prefix, message));
  }

  logError(prefix: string, message: string, error?: any) {
    if (this.shouldLog("error")) {
      console.error(this.formatMessage("error", prefix, message));
      if (error) console.error(error);
    }
  }
}

export const logger = new Logger();
