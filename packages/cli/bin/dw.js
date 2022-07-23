#!/usr/bin/env node

const program = require("commander");
const chalk = require("chalk");
const minimist = require("minimist");
// const loadCommand = require("../lib/util/loadCommand");

program.version(`@dworld/cli ${require("../package.json").version}`).usage("<command> [options]");

program
  .command("create <app-name>")
  .description("create a new project powered by dworld cli")
  //   .option("-p, --preset <presetName>", "Skip prompts and use saved or remote preset")
  //   .option("-d, --default", "Skip prompts and use default preset")
  //   .option("-i, --inlinePreset <json>", "Skip prompts and use inline JSON string as preset")
  //   .option("-m, --packageManager <command>", "Use specified npm client when installing dependencies")
  //   .option("-r, --registry <url>", "Use specified npm registry when installing dependencies (only for npm)")
  //   .option("-g, --git [message]", "Force git initialization with initial commit message")
  //   .option("-n, --no-git", "Skip git initialization")
  //   .option("-f, --force", "Overwrite target directory if it exists")
  //   .option("--merge", "Merge target directory if it exists")
  //   .option("-c, --clone", "Use git clone when fetching remote preset")
  //   .option("-x, --proxy <proxyUrl>", "Use specified proxy when creating project")
  //   .option("-b, --bare", "Scaffold project without beginner instructions")
  //   .option("--skipGetStarted", 'Skip displaying "Get started" instructions')
  .action((name, options) => {
    if (minimist(process.argv.slice(3))._.length > 1) {
    }
    // --git makes commander to default git to true
    // if (process.argv.includes("-g") || process.argv.includes("--git")) {
    //   options.forceGit = true;
    // }
    require("../lib/create")(name, options);
  });

program.on("--help", () => {
  console.log();
  console.log(`  Run ${chalk.cyan(`vue <command> --help`)} for detailed usage of given command.`);
  console.log();
});

program.parse(process.argv);
