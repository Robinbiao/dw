"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_router_1 = __importDefault(require("vue-router"));
const version = require('../package.json').version;
const DefaultConfig = {
    mountEl: '#app'
};
class DCore {
    constructor(options) {
        this._version = version;
        this._options = Object.assign({}, DefaultConfig, options);
    }
    initRouter() {
        new vue_router_1.default({});
    }
    initStore() { }
    createApp() { }
}
exports.default = DCore;
