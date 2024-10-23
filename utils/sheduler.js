const moment = require("moment");
const { log, error } = require("./consoller");

function getNextScheduledTime(timeStr) {
  const now = moment();
  const scheduledTime = moment(timeStr, "HH:mm:ss");
  scheduledTime.set({
    year: now.year(),
    month: now.month(),
    date: now.date(),
  });

  if (scheduledTime.isBefore(now)) {
    scheduledTime.add(1, "days");
  }

  return scheduledTime;
}

function scheduleDailyTasks(callback, timesArray) {
  timesArray.forEach((timeStr) => {
    const nextScheduledTime = getNextScheduledTime(timeStr);

    if (!nextScheduledTime) {
      error(`Invalid time format: ${timeStr}`);
      return;
    }

    const timeDifference = nextScheduledTime.diff(moment());

    const SECONDS = 24 * 60 * 60 * 1000;

    setTimeout(() => {
      callback(timeStr);
      setInterval(() => {
        callback(timeStr);
      }, SECONDS);
    }, timeDifference);

    log(
      `Scheduled daily task for ${timeStr} at ${nextScheduledTime.format(
        "HH:mm:ss"
      )}`
    );
  });
}

module.exports = {
  scheduleDailyTasks,
};
