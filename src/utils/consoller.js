const figlet = require("figlet");

const startPrint = async (message) => {
  return new Promise((res) => {
    figlet.text(
      message,
      {
        font: "Big", // You can choose from different fonts (Standard, Slant, Big, etc.)
      },
      async (err, data) => {
        if (err) {
          console.error("Something went wrong...");
          console.dir(err);
          return;
        }

        const chalk = await import("chalk");

        const terminalWidth = process.stdout.columns;

        // Split the figlet text into lines to center them individually
        const lines = data.split("\n");
        lines.forEach((line) => {
          const padding = Math.max(
            0,
            Math.floor((terminalWidth - line.length) / 2)
          );
          console.log(chalk.default.blue(" ".repeat(padding) + line));
        });

        res();
      }
    );
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
