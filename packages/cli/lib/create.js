const fs = require('fs-extra')
const path = require('path')
const inquirer = require('inquirer')
const execRun = require('./util/exec-run')
const { hasGit, hasProjectGit } = require('./util/check-git')

async function create(projectName, options) {
  const templateName = options.project ? 'project' : 'default'
  const { targetDir, name } = await GenerateAppDir(projectName, options)
  const copySrc = path.resolve(__dirname, '../template', templateName)
  fs.copySync(copySrc, targetDir)
  await updatePkg(targetDir, { name })
  initGit(targetDir)
}

async function GenerateAppDir(projectName, options) {
  const cwd = options.cwd || process.cwd()
  const inCurrent = projectName === '.'
  const name = inCurrent ? path.relative('../', cwd) : projectName
  const targetDir = path.resolve(cwd, projectName || '.')
  if (fs.existsSync(targetDir)) {
    await fs.remove(targetDir)
  }
  fs.mkdirSync(targetDir)
  return { targetDir, name }
}

/**
 * 更新package.json信息
 */
async function updatePkg(targetDir, options = {}) {
  const pkgSrc = path.resolve(targetDir, 'package.json')
  const pkgPrompt = await inquirer.prompt(require('./util/pkg-prompt'))
  if (fs.existsSync(pkgSrc)) {
    const pkg = JSON.parse(fs.readFileSync(pkgSrc, 'utf-8'))
    pkg.name = options.name
    Object.keys(pkgPrompt).forEach((key) => {
      pkg[key] = pkgPrompt[key]
    })
    fs.writeJsonSync(pkgSrc, pkg, { spaces: 2 })
  }
}

/**
 * 初始化git信息
 * @param {string} cwd  当前目录地址
 */
async function initGit(cwd) {
  if (hasGit()) {
    // 已经安装git
    if (!hasProjectGit(cwd)) {
      await execRun(cwd, 'git init')
    }
    await execRun(cwd, 'git add .')
    await execRun(cwd, 'git commit -m "init"')
  }
}

module.exports = create
