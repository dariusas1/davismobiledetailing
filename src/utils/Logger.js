class Logger {
  static log(message, data = {}) {
    console.log(`[${new Date().toISOString()}] ${message}`, data);
  }

  static error(message, error = {}) {
    console.error(`[${new Date().toISOString()}] ERROR: ${message}`, {
      message: error.message,
      stack: error.stack,
      ...error
    });
  }

  static warn(message, data = {}) {
    console.warn(`[${new Date().toISOString()}] WARNING: ${message}`, data);
  }

  static info(message, data = {}) {
    console.info(`[${new Date().toISOString()}] INFO: ${message}`, data);
  }

  static debug(message, data = {}) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[${new Date().toISOString()}] DEBUG: ${message}`, data);
    }
  }
}

export default Logger;
