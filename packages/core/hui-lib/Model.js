import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _classPrivateFieldLooseBase from "@babel/runtime/helpers/esm/classPrivateFieldLooseBase";
import _classPrivateFieldLooseKey from "@babel/runtime/helpers/esm/classPrivateFieldLooseKey";
import Fetch from './fetch';
import _initRouter, { setRouterOpts, navigate, go } from './router';
import * as utils from './utils/api';
import { Model, version } from './core';
import { registerMiddleware as middleware, beforeLaunch } from './middleware';
import { on, once, off, emit, trigger } from './event';
import { logger, log } from './log';
import { storage } from 'hui-sdk';

var _app = /*#__PURE__*/_classPrivateFieldLooseKey("app");

var _isNavigable = /*#__PURE__*/_classPrivateFieldLooseKey("isNavigable");

var _options = /*#__PURE__*/_classPrivateFieldLooseKey("options");

var _walkOpts = /*#__PURE__*/_classPrivateFieldLooseKey("walkOpts");

var HCore = /*#__PURE__*/function () {
  function HCore(_opts) {
    _classCallCheck(this, HCore);

    Object.defineProperty(this, _walkOpts, {
      value: _walkOpts2
    });
    Object.defineProperty(this, _app, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _isNavigable, {
      writable: true,
      value: true
    });
    Object.defineProperty(this, _options, {
      writable: true,
      value: {
        el: '#app'
      }
    });

    if (!!_classPrivateFieldLooseBase(this, _app)[_app]) {
      return _classPrivateFieldLooseBase(this, _app)[_app];
    }

    _classPrivateFieldLooseBase(this, _app)[_app] = this;

    _classPrivateFieldLooseBase(this, _walkOpts)[_walkOpts](_opts);

    this.Model.prototype.$hCore = _classPrivateFieldLooseBase(this, _app)[_app];

    if (!this.ajax) {
      var fetch = new Fetch();
      utils.extend(this, {
        ajax: fetch,
        fetch: fetch
      });
    }

    utils.extend(this, {
      middleware: middleware
    });
    utils.extend(this, {
      on: on,
      once: once,
      off: off,
      emit: emit,
      trigger: trigger
    });
    utils.extend(this, {
      log: log,
      logger: logger
    });
    utils.extend(this, {
      utils: utils
    });
    utils.extend(this, {
      storage: storage
    });
    utils.extend(this, {
      navigate: navigate,
      go: go
    });
  }

  _createClass(HCore, [{
    key: "Model",
    get: function get() {
      return Model;
    }
  }, {
    key: "options",
    get: function get() {
      return _classPrivateFieldLooseBase(this, _options)[_options];
    }
  }, {
    key: "version",
    get: function get() {
      return version;
    }
  }, {
    key: "initRouter",
    value: function initRouter(routes, opts) {
      if (_classPrivateFieldLooseBase(this, _isNavigable)[_isNavigable]) {
        var router = _initRouter(routes, opts);

        utils.extend(_classPrivateFieldLooseBase(this, _options)[_options], {
          router: router,
          template: '<router-view></router-view>'
        });
        utils.extend(this, {
          router: router
        });
      }
    }
  }, {
    key: "addRoutes",
    value: function addRoutes(routes) {
      if (this.router) {
        this.log.debug('新增 Routes 路由记录', routes);
        this.router.addRoutes(routes);
      } else {
        this.initRouter(routes);
      }
    }
  }, {
    key: "start",
    value: function start(cb) {
      var _this = this;

      // 在应用前要确保已经完成路由系统的初始化
      if (!this.router) {
        this.initRouter();
      } // 这里最好不要有异步逻辑，在微前端框架下可能会出现问题
      // 暂时不对外


      beforeLaunch.final(function () {
        // 在微前端框架下应用生命周期被接管
        if (!utils.isMicroApp()) {
          _this.root = new _this.Model(_classPrivateFieldLooseBase(_this, _options)[_options]);

          _this.root.$nextTick(function () {
            trigger('app-ready', _this.root);
            cb && cb(_this.root);
          });
        } else {
          // 启动的回调函数传递给 singleSpaVue，保持和独立运行一致的处理逻辑
          trigger('app-start', cb);
        }
      });
      beforeLaunch.justRun(this);
    }
  }]);

  return HCore;
}();

function _walkOpts2(opts) {
  var _this2 = this;

  if (utils.isPlainObject(opts)) {
    Object.keys(opts).forEach(function (key) {
      // ajaxConfig === fetchConfig
      if (key === 'ajaxConfig' || key === 'fetchConfig') {
        var fetch = new Fetch(opts[key]);
        utils.extend(_this2, {
          ajax: fetch,
          fetch: fetch
        }); // ajax === fetch
      } // logLevel


      if (key === 'logLevel') {
        logger.setLevel(opts[key]);
      } // extra vue options


      if (key === 'extraModelOptions') {
        var staticModelKey = ['router'];
        Object.keys(opts[key]).filter(function (modelKey) {
          return !staticModelKey.includes(modelKey);
        }).forEach(function (modelKey) {
          utils.extend(_classPrivateFieldLooseBase(_this2, _options)[_options], _defineProperty({}, modelKey, opts[key][modelKey])); // store

          if (modelKey === 'store') {
            utils.extend(_this2, _defineProperty({}, modelKey, opts[key][modelKey]));
          }
        });
      } // extra router options


      if (key === 'extraRouterOptions') {
        if (typeof opts[key]['isNavigable'] !== 'undefined') {
          _classPrivateFieldLooseBase(_this2, _isNavigable)[_isNavigable] = opts[key]['isNavigable'];
        }

        if (_classPrivateFieldLooseBase(_this2, _isNavigable)[_isNavigable]) {
          _classPrivateFieldLooseBase(_this2, _isNavigable)[_isNavigable] && setRouterOpts(opts[key]);
        }
      }
    });
  }
}

export { HCore as default };