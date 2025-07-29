import log from 'loglevel';

log.setLevel('info'); // Set logging level (trace, debug, info, warn, error)

const logger = {
  info: (message) => log.info(message),
  warn: (message) => log.warn(message),
  error: (message) => log.error(message),
  debug: (message) => log.debug(message)
};

export default logger;
