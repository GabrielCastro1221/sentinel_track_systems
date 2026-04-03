const { Command } = require("commander");

const program = new Command();

program
    .option("--mode <mode>", "enviroment", "build")
    .option("--port <port>", "port", "8080");
program.parse();

module.exports = program;