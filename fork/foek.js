const { fork } = require("child_process");

const timeFunction = async (time) => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res(time);
    }, time);
  });
};

for (let i = 0; i < 3; i++) {
  const child = fork("./child.js");
  child.send({ task: `Task ${i + 1}`, data: i + 1 });

  // Listen for messages from the child process
  child.on("message", (msg) => {
    console.log(">> 17msg", msg);
  });
}
