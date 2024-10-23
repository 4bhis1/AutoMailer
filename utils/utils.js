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

module.exports = {
  fakePromise,
  getEmail,
};
