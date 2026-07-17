export const logger = {
  info: (message: string, ...args: unknown[]) => {
    console.log(`[${now()}] [INFO] ${message}`, ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(`[${now()}] [WARN] ${message}`, ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    console.error(`[${now()}] [ERROR] ${message}`, ...args);
  },
};

const now = () => new Date().toISOString();
