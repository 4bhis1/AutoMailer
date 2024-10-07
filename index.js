(async () => {
  const { startPrint } = require("./src/utils/consoller.js");
  const { handler } = require("./src/handler.js");

  await startPrint("Automate Job");

  handler();
})();
