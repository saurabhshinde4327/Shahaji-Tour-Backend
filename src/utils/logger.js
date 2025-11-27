// Logger utility

const log = {
  info: (message, ...args) => {
    console.log(`ℹ️  ${message}`, ...args);
  },
  
  error: (message, ...args) => {
    console.error(`❌ ${message}`, ...args);
  },
  
  success: (message, ...args) => {
    console.log(`✅ ${message}`, ...args);
  },
  
  warning: (message, ...args) => {
    console.warn(`⚠️  ${message}`, ...args);
  }
};

module.exports = log;

