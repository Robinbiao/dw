var path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  transpileDependencies: true,
  chainWebpack: (config) => {
    config.resolve.alias.set('@dworld', resolve('../'))
  }
}
