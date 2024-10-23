const {
  fetchCompanyDomain,
} = require("./automate/generateEmail/fetchEmailDomain");
const { startScraping } = require("./automate/scrapJobs");
const JsonDB = require("./utils/jsonB");
const { fakePromise } = require("./utils/utils");
const sendEmailToCompanies = require("./automate/sendEmail.js");
const { startPrint } = require("./utils/consoller.js");

(async () => {
  await startPrint("Automate Job");

  const companyJson = new JsonDB("Company", {});
  // await startScraping(companyJson);

  // companyJson.read(async (companies) => {
  //   companies = Object.values(companies);
  //   for (let company of companies) {
  //     console.log(
  //       "🚀 ~ file: index.js:14 ~ companyJson.read ~ company:",
  //       company
  //     );
  //     await fetchCompanyDomain(company.companyName);
  //     await fakePromise();
  //   }
  // });

  sendEmailToCompanies(companyJson);
})();

// (async () => {
// const { handler } = require("./src/handler.js");

// await startPrint("Automate Job");

//   handler();
// })();
