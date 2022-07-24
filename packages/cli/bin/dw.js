#!/usr/bin/env node

const program = require("commander");
const chalk = require("chalk");
const minimist = require("minimist");
// const loadCommand = require("../lib/util/loadCommand");

program.version(`@dworld/cli ${require("../package.json").version}`).usage("<command> [options]");

program
  .command("create <app-name>")
  .description("create a new project powered by dworld cli")
  .option("-p, --project", "vue project run")
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
