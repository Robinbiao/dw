import Model from 'vue'
import Router from 'vue-router'
const version = require('../package.json').version

const DefaultConfig = {
  mountEl: '#app'
}
class DCore {
  _version: string
  _options: coreOptions
  constructor(options:coreOptions) {
    this._version = version
    this._options = Object.assign({}, DefaultConfig, options)
  }
  initRouter() {
    new Router({})
  }
  initStore() {}
  createApp() {}
}

export default DCore
