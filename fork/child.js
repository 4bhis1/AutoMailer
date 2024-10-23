process.on("message", (message) => {
  console.log(">> message", message);

  const timeout = /* Math.random() * message.data * */ 2000;

  setTimeout(() => {
    const result = `Result from ${message.task} - Processed data: ${message.data}`;
    console.log(">>> timeout", timeout);
    // Send the result back to the parent process
    process.send(result);
  }, timeout); // Random delay to simulate async process
});
