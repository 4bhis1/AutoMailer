const JsonDB = require("../utils/jsonB");
const { sendEmail } = require("../utils/mailer");

const sendEmailToCompanies = async (companyJsonInstance) => {
  let company = await new Promise((res, rej) => {
    companyJsonInstance.read((data) => {
      const companyList =
        Object.keys(data)[
          Math.floor(Math.random() * Object.values(data).length)
        ];
      res(data[companyList].companyName);
    });
  });

  const emails = new JsonDB(company, {}, "companies");

  emails.read((data) => {
    console.log(">>>>???>>>", data);
  });

  //   const getRandomCompany = await sendEmail();
};

module.exports = sendEmailToCompanies;
