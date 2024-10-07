const figlet = require("figlet");

const startPrint = async (message) => {
  return new Promise((res) => {
    figlet(message, async function (err, data) {
      const chalk = await import("chalk");
      if (err) {
        return;
      }
      console.log(chalk.default.blue(data));
      res();
    });
  });
};

const log = async (message) => {
  const chalk = await import("chalk");
  const date = new Date();
  console.log(chalk.default.magenta(date), chalk.default.blue(message));
};

const error = async (message) => {
  const chalk = await import("chalk");
  const date = new Date();
  console.log(chalk.default.magenta(date), chalk.default.red(message));
};

module.exports = {
  startPrint,
  log,
  error,
};
