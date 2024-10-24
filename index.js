const {
  fetchCompanyDomain,
} = require("./automate/generateEmail/fetchEmailDomain");
const { startScraping } = require("./automate/scrapJobs");
const JsonDB = require("./utils/jsonB");
const { fakePromise, checkInfo } = require("./utils/utils");
const sendEmailToCompanies = require("./automate/sendEmail.js");
const { startPrint, log } = require("./utils/consoller.js");
const EmitOnceEmitter = require("./utils/enventEmitter.js");

(async () => {
  await startPrint("Automate Job");

  checkInfo();

  const scrapCompanyEvent = new EmitOnceEmitter(true);
  const sendEmailEvent = new EmitOnceEmitter();

  const companyJson = new JsonDB("Company", {});

  sendEmailEvent.listenToEventOnce("triggerEmailSend", async () => {
    sendEmailToCompanies(companyJson);
  });

  scrapCompanyEvent.listenToEvent("triggerEmailScrap", (data) => {
    companyJson.read(async (companies) => {
      log("Fetching emails for companies...");
      companies = Object.values(companies);
      for (let company of companies) {
        try {
          log(`Creating emails for ${company.companyName}`);
          await fetchCompanyDomain(company.companyName, sendEmailEvent);
          await fakePromise();
        } catch (error) {
          console.log(error);
        }
      }
    });
  });

  companyJson.read(async (companies) => {
    if (Object.keys(companies).length) {
      scrapCompanyEvent.triggerEvent("triggerEmailScrap", {
        message: "Trigger email scrapping process.",
      });
      sendEmailEvent.triggerEvent("triggerEmailSend", {
        message: "Start sending emails.",
      });
    }
  });

  startScraping(companyJson, scrapCompanyEvent);
})();
