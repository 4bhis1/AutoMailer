const {
  fetchCompanyDomain,
} = require("./automate/generateEmail/fetchEmailDomain");
const { startScraping } = require("./automate/scrapJobs");
const JsonDB = require("./utils/jsonB");
const { fakePromise } = require("./utils/utils");

(async () => {
  const companyJson = new JsonDB("Company", {});
  // await startScraping(companyJson);

  companyJson.read(async (companies) => {
    companies = Object.values(companies);
    for (let company of companies) {
      console.log(
        "🚀 ~ file: index.js:14 ~ companyJson.read ~ company:",
        company
      );
      await fetchCompanyDomain(company.companyName);
      await fakePromise();
    }
  });

})()


// (async () => {
//   const { startPrint } = require("./src/utils/consoller.js");
//   const { handler } = require("./src/handler.js");

//   await startPrint("Automate Job");

//   handler();
// })();
