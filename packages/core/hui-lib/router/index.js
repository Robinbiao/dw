import _typeof from "@babel/runtime/helpers/esm/typeof";
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { Model, Router } from '../core';
import { extend, isPlainObject, isUndefined } from '../utils';
import { beforeRouteChange, afterRouteChange } from '../middleware';
import { log } from '../log';
var isNavigationFailure = Router.isNavigationFailure,
    NavigationFailureType = Router.NavigationFailureType;
var encodeReserveRE = /[!'()*]/g;

var encodeReserveReplacer = function encodeReserveReplacer(c) {
  return '%' + c.charCodeAt(0).toString(16);
};

var commaRE = /%2C/g; // fixed encodeURIComponent which is more conformant to RFC3986:
// - escapes [!'()*]
// - preserve commas

var encode = function encode(str) {
  return encodeURIComponent(str).replace(encodeReserveRE, encodeReserveReplacer).replace(commaRE, ',');
};

var decode = decodeURIComponent;
var defaultRouterOpts = {
  scrollBehavior: function scrollBehavior() {
    return {
      x: 0,
      y: 0
    };
  }
};
var router = null;
export default function initRouter(routes, opts) {
  if (router) return router; // 避免在调用 initRouter 之前注册，在 1.0 的场景下，多个子应用都访问 hui-core 的情况下会造成冲突

  Model.use(Router); // 合并 defaultRouterOpts

  opts = _objectSpread(_objectSpread({}, defaultRouterOpts), opts); // 保证在 hash 模式下也能从 location.search 中读取查询参数
  // TODO - 暂时还没有解决方案，在主子应用同时存在路由参数的情况下，url 会存在多个 search 片段的问题

  if (opts.mode === 'hash') {
    opts = _objectSpread(_objectSpread({}, opts), {}, {
      parseQuery: function parseQuery(query) {
        var res = {};
        query = query.trim().replace(/^(\?|#|&)/, '');

        if (!query) {
          var _location = location,
              search = _location.search;
          search = search.trim().replace(/^(\?|#|&)/, '');

          if (!search) {
            return res;
          }

          query = search;
        }

        query.split('&').forEach(function (param) {
          var parts = param.replace(/\+/g, ' ').split('=');
          var key = decode(parts.shift());
          var val = parts.length > 0 ? decode(parts.join('=')) : null;

          if (res[key] === undefined) {
            res[key] = val;
          } else if (Array.isArray(res[key])) {
            res[key].push(val);
          } else {
            res[key] = [res[key], val];
          }
        });
        return res;
      },
      stringifyQuery: function stringifyQuery(obj) {
        var res = obj ? Object.keys(obj).map(function (key) {
          var val = obj[key];

          if (val === undefined) {
            return '';
          }

          if (val === null) {
            return encode(key);
          }

          if (Array.isArray(val)) {
            var result = [];
            val.forEach(function (val2) {
              if (val2 === undefined) {
                return;
              }

              if (val2 === null) {
                result.push(encode(key));
              } else {
                result.push(encode(key) + '=' + encode(val2));
              }
            });
            return result.join('&');
          }

          return encode(key) + '=' + encode(val);
        }).filter(function (x) {
          return x.length > 0;
        }).join('&') : null;

        if (res && !location.search.includes(res)) {
          return "?".concat(res);
        }

        return '';
      }
    });
  }

  router = new Router(opts);

  if (routes) {
    router.addRoutes(routes);
  }

  log.debug('Router 实例', router);
  log.debug('Router 构建选项', opts);
  log.debug('Routes 路由记录', router.getRoutes());
  router.beforeEach(function (to, from, next) {
    log.debug('路由跳转前置导航守卫', to, from);
    next();
  });
  beforeRouteChange.middlewares.forEach(function (middleware) {
    return router.beforeEach(middleware);
  });
  router.afterEach(function (to, from) {
    log.debug('路由跳转后置导航守卫', to, from);
    afterRouteChange.justRun(to, from);
  });
  return router;
}
/**
 * Set default router options
 * @param {object} opts
 */

export function setRouterOpts(opts) {
  extend(defaultRouterOpts, opts);
}
/**
 * @description jump programmatically
 * @param {String} path target path
 * @param {Object} opts options
 * @param {Boolean} opts.history whether to keep current browser history, perform like pushState or replaceState, default true
 * @param {Boolean} opts.animation todo
 * @param {Object} query query params
 */

export function navigate(path, opts, query) {
  if (!router) return;
  var defaultOpts = {
    history: true
  };
  var defaultQuery = {};

  if (!_typeof(path) === 'string' || path === '') {
    log.error('navigate 方法必须指定 path 为字符串类型且不能为空');
    return false;
  } // 只有两个参数，则第二个为 query


  if (isPlainObject(opts) && isUndefined(query)) {
    query = opts;
    opts = defaultOpts;
  } // path 是必填项


  if (isUndefined(opts)) {
    opts = defaultOpts;
    query = defaultQuery;
  }

  var _opts = opts,
      history = _opts.history;

  var onError = function onError(err) {
    if (isNavigationFailure(err, NavigationFailureType.duplicated) || isNavigationFailure(err, NavigationFailureType.redirected)) {
      return;
    }

    log.error('路由跳转异常', err);
    throw err;
  };

  if (history) {
    router.push({
      path: path,
      query: query
    }).catch(onError);
  } else {
    router.replace({
      path: path,
      query: query
    }).catch(onError);
  }
}
/**
 * @description go forwards or go backwards in the history stack programmatically
 * @param {Number} n steps to go, setting to 0 perform like reload
 */

export function go(n) {
  if (!router) return;
  router.go(n);
}