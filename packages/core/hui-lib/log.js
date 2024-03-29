import { createLogger } from 'hui-logger';
export var logger = createLogger();
export var log = function log() {
  for (var _len = arguments.length, content = new Array(_len), _key = 0; _key < _len; _key++) {
    content[_key] = arguments[_key];
  }

  return logger.info.apply(logger, content);
};
logger.levels.forEach(function (level) {
  log[level] = function () {
    for (var _len2 = arguments.length, content = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      content[_key2] = arguments[_key2];
    }

    return logger[level].apply(logger, content);
  };
});