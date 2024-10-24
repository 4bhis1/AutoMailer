const userInfo = require("../config/userDetails.json");
const { error } = require("./consoller");

const fakePromise = async () => {
  const randomDelay = Math.random() * 150000;

  return new Promise((res, rej) => {
    setTimeout(() => {
      res(randomDelay);
    }, randomDelay);
  });
};

const getEmail = (name, companyDomain) => {
  return (name.split(" ").join(".") + "@" + companyDomain)
    .toString()
    .replace("@@", "@");
};


function filterJobDescription(jobDescription) {
  // Convert the job description to lowercase to handle case-insensitive matching
  const jobText = jobDescription.toLowerCase();

  // Count the number of matches with your skillKeywords
  let matchCount = 0;

  userInfo.skillKeywords.forEach(skill => {
    if (jobText.includes(skill.toLowerCase())) {
      matchCount++;
    }
  });

  return matchCount
}

const checkInfo = () => {
  const fields = [
    "name",
    "phoneNumber",
    "email",
    "linkedin",
    "experience",
    "skillKeywords",
  ]

  for (let field of fields) {
    if (!userInfo[field]) {
      error(`Missing field: ${field}`)
      throw new Error(`Missing field: ${field}`)
    }
  }

}

module.exports = {
  fakePromise,
  getEmail,
  filterJobDescription,
  checkInfo
};
