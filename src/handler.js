const { sendEmail } = require("./utils/mailer");
const { scheduleDailyTasks } = require("./utils/sheduler");

sendEmail("4bhis1@gmail.com", "Hello test", "this is my contenr");

const handler = async () => {
  const scheduleEmailAt = ["12:00:00", "13:00:00"];

  scheduleDailyTasks((time) => {
    log(`>>> time ${time}`);
  }, scheduleEmailAt);
};

module.exports = {
  handler,
};
