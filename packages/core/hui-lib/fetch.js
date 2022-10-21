import _createClass from "@babel/runtime/helpers/esm/createClass";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { ajax } from 'hui-sdk';
import { extend } from './utils';
import { MiddlewareManager, beforeRequestSend, afterRequestSend } from './middleware';
import { log, logger } from './log';

function final_(error, response) {
  if (error) {
    return Promise.reject(error);
  }

  return Promise.resolve(response);
}
/**
 * 合并全局配置和实例配置
 * @param {Object} defaultConfig 全局配置
 * @param {Object} config 实例配置
 * @returns 合并后的请求配置
 */


function mergeConfig(defaultConfig, config) {
  var mergedConfig = _objectSpread(_objectSpread({}, defaultConfig), config);

  if (mergedConfig.shouldMergeHeaders) {
    var defaultHeaders = defaultConfig.headers;
    var configHeaders = config.headers;

    var mergedHeaders = _objectSpread(_objectSpread({}, defaultHeaders), configHeaders);

    mergedConfig.headers = mergedHeaders;
  }

  return mergedConfig;
}

var defaultConfig = {
  method: 'post',
  data: {},
  timeout: 5000,
  headers: {},
  withCredentials: false
};

var Fetch = /*#__PURE__*/_createClass(function Fetch() {
  var _config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  _classCallCheck(this, Fetch);

  extend(defaultConfig, _config);
  beforeRequestSend.final(function (config) {
    return new Promise(function (resolve, reject) {
      var error, response;
      ajax(config).then(function (res) {
        return response = res;
      }).catch(function (err) {
        return error = err;
      }).finally(function () {
        afterRequestSend.runAndReturn(error, response).then(resolve).catch(reject);
      });
    });
  });
  afterRequestSend.final(final_);

  function fetch(config) {
    log.debug('Fetch 实例初始化选项', mergeConfig(defaultConfig, config));
    return beforeRequestSend.runAndReturn(mergeConfig(defaultConfig, config));
  }

  fetch.get = function (url, config) {
    if (config) {
      extend(config, {
        url: url,
        method: 'get'
      });
    } else {
      config = {
        url: url,
        method: 'get'
      };
    }

    return fetch(config);
  };

  fetch.post = function (url, data, config) {
    if (config) {
      extend(config, {
        url: url,
        method: 'post',
        data: data
      });
    } else {
      config = {
        url: url,
        method: 'post',
        data: data
      };
    }

    return fetch(config);
  };

  return fetch;
});

export { Fetch as default };
export function initFetch() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$defaultConfig = _ref.defaultConfig,
      defaultConfig = _ref$defaultConfig === void 0 ? {
    method: 'post',
    data: {},
    timeout: 5000,
    headers: {},
    withCredentials: false
  } : _ref$defaultConfig,
      _ref$beforeRequestSen = _ref.beforeRequestSendMiddlewares,
      beforeRequestSendMiddlewares = _ref$beforeRequestSen === void 0 ? [] : _ref$beforeRequestSen,
      _ref$afterRequestSend = _ref.afterRequestSendMiddlewares,
      afterRequestSendMiddlewares = _ref$afterRequestSend === void 0 ? [] : _ref$afterRequestSend;

  var beforeRequestSend = new MiddlewareManager('before-request-send');
  beforeRequestSend.concat(beforeRequestSendMiddlewares);
  var afterRequestSend = new MiddlewareManager('after-request-send');
  afterRequestSend.concat(afterRequestSendMiddlewares);
  afterRequestSend.final(final_);
  beforeRequestSend.final(function (config) {
    return new Promise(function (resolve, reject) {
      var error, response;
      ajax(config).then(function (res) {
        return response = res;
      }).catch(function (err) {
        return error = err;
      }).finally(function () {
        afterRequestSend.runAndReturn(error, response).then(resolve).catch(reject);
      });
    });
  });

  var fetch = function fetch(config) {
    log.debug('Fetch 实例初始化选项', mergeConfig(defaultConfig, config));
    return beforeRequestSend.runAndReturn(mergeConfig(defaultConfig, config));
  };

  fetch.get = function (url, config) {
    if (config) {
      extend(config, {
        url: url,
        method: 'get'
      });
    } else {
      config = {
        url: url,
        method: 'get'
      };
    }

    return fetch(config);
  };

  fetch.post = function (url, data, config) {
    if (config) {
      extend(config, {
        url: url,
        method: 'post',
        data: data
      });
    } else {
      config = {
        url: url,
        method: 'post',
        data: data
      };
    }

    return fetch(config);
  };

  return fetch;
}