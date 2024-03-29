import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
var _excluded = ["meta"];
import HCore from './Model';
import Fetch, { initFetch } from './fetch';
import * as utils from './utils/api';
import { setRouterOpts, navigate, go } from './router';
import { setConfig, storage } from 'hui-sdk';
import { on, once, off, emit, trigger } from './event';
import { registerMiddleware as middleware } from './middleware';
import { log, logger } from './log';
import { Model, Router, version } from './core';
/**
 * 整个应用框架接口应该有且仅有三种调用方式：
 *
 * 1. 通过应用实例调用，这应该是首选的调用方式，适合在应用入口或者 vue 文件中，具体如下：
 *    const app = hCore();
 *    app.ajax 或者 this.$hCore.ajax
 *
 * 2. 通过 hCore 函数对象调用，这应该可以覆盖非 vue 实例的场景，比如在一个普通的 js 文件中调用，具体如下：
 *    hCore.ajax
 *
 * 3. 通过 hui-core 暴露的接口调用，这样的接口应该是有限的，目前包括：
 *    - hCoreReference
 *    - initFetch
 *    - initRouter
 *    - initRouterLayout
 *
 * 4. 通过 @@/huiExports 动态扩展 hui-core
 */

var hCoreReference;
var hCoreOpts = {
  meta: {
    versions: {
      'hui-core': version,
      vue: Model.version,
      'vue-router': Router.version
    }
  }
};
export default function hCore(opts) {
  if (utils.isPlainObject(opts)) {
    // 设置日志级别
    logger.setLevel(opts.logLevel || 'info'); // 合并元数据信息

    if (opts.meta) {
      for (var key in opts.meta) {
        if (Object.hasOwnProperty.call(opts.meta, key)) {
          if (key === 'versions') {
            hCoreOpts.meta.versions = _objectSpread(_objectSpread({}, hCoreOpts.meta.versions), opts.meta.versions);
          } else {
            hCoreOpts.meta[key] = opts.meta[key];
          }
        }
      }
    }

    var meta = opts.meta,
        extra = _objectWithoutProperties(opts, _excluded);

    hCoreOpts = _objectSpread(_objectSpread({}, hCoreOpts), extra);
  }

  hCoreReference = new HCore(hCoreOpts);
  log.debug('应用元数据信息', hCoreOpts.meta);
  log.debug('hCore 实例', hCoreReference);
  log.debug('hCore 构建选项', hCoreOpts);
  return hCoreReference;
}
setConfig({
  logger: logger
}); // 支持扩展 HCore 的原型方法

utils.extend(hCore, {
  extend: function extend(opts) {
    // Handle case when target is a string or something (possible in deep copy)
    if (!utils.isPlainObject(opts)) return false; // Extend the base object

    for (var name in opts) {
      if (Object.hasOwnProperty.call(opts, name)) {
        var copy = opts[name]; // Prevent Object.prototype pollution
        // Prevent never-ending loop

        if (name === '__proto__' || opts === copy) {
          continue;
        } // Recurse if we're merging plain objects or arrays


        if (copy && (utils.isPlainObject(copy) || utils.isArray(copy))) {
          // Handle a deep copy situation
          HCore.prototype[name] = utils.deepClone(copy); // Don't bring in undefined values
        } else if (copy !== undefined) {
          HCore.prototype[name] = copy;
        }
      }
    }
  }
});
utils.extend(hCore, {
  middleware: middleware
});
utils.extend(hCore, {
  log: log,
  logger: logger
});
utils.extend(hCore, {
  navigate: navigate,
  go: go
});
utils.extend(hCore, {
  on: on,
  once: once,
  off: off,
  emit: emit,
  trigger: trigger
});
utils.extend(hCore, {
  storage: storage
});
utils.extend(hCore, {
  utils: utils
});

if (hCoreOpts['ajaxConfig'] || hCoreOpts['fetchConfig']) {
  var fetch = new Fetch(hCoreOpts['ajaxConfig'] || hCoreOpts['fetchConfig']);
  utils.extend(hCore, {
    ajax: fetch,
    fetch: fetch
  });
} else {
  var _fetch = new Fetch();

  utils.extend(hCore, {
    ajax: _fetch,
    fetch: _fetch
  });
}

export { hCoreReference };
export { initFetch };
export { default as initRouterLayout } from './router/routerLayout';
export { setRouterOpts as initRouterOptions };
/** Legacy for bundler <= 1.3.4 */

export var initRouter = function initRouter(routes, opts) {
  return setRouterOpts(utils.extend(opts, {
    routes: routes
  }));
};
export * from '@@/huiExports';