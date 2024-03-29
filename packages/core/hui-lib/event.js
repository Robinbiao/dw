import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";

var _arguments = typeof arguments === "undefined" ? void 0 : arguments;

import { log } from './log';
/**
 * https://github.com/developit/mitt
 */

function mitt(all) {
  all = all || new Map();
  return {
    on: function on(type, handler) {
      var handlers = all.get(type);
      var added = handlers && handlers.push(handler);

      if (!added) {
        all.set(type, [handler]);
      }

      log.debug('部署事件监听', type);
    },
    off: function off(type, handler) {
      var handlers = all.get(type);

      if (handlers) {
        if (handler) {
          handlers.splice(handlers.indexOf(handler) >>> 0, 1);
        } else {
          all.set(type, []);
        }
      }

      log.debug('取消事件监听', type);
    },
    emit: function emit(type) {
      log.debug.apply(log, ['触发事件监听'].concat(Array.prototype.slice.call(arguments)));
      var args = Array.prototype.slice.call(arguments);
      (all.get(type) || []).slice().map(function (handler) {
        log.debug('响应事件监听', type, handler);
        handler.apply(null, args.slice(1));
      });
      (all.get('*') || []).slice().map(function (handler) {
        log.debug('响应事件监听', type, handler);
        handler.apply(null, args);
      });
    }
  };
}

var emitter = mitt();

emitter.once = function (type, handler) {
  var _handler = function _handler() {
    handler.apply(null, _toConsumableArray(_arguments));
    emitter.off(type, _handler);
  };

  emitter.on(type, _handler);
};

var on = emitter.on,
    once = emitter.once,
    off = emitter.off,
    emit = emitter.emit,
    trigger = emitter.emit;
export { on, once, off, emit, trigger };