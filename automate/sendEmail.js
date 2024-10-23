const JsonDB = require("../utils/jsonB");
const { sendEmail } = require("../utils/mailer");

const sendEmailToCompanies = async (companyJsonInstance) => {

  console.log(">> this s ccej ")
  const func = async () => {
    let company = await new Promise((res, rej) => {
      companyJsonInstance.read((data) => {
        const companyList =
          Object.keys(data)[
          Math.floor(Math.random() * Object.values(data).length)
          ];
        res(data[companyList]);
      });
    });
    console.log(">> copamu", company)
    const emails = new JsonDB(company.companyName, {}, "companies");

    const email = await new Promise((res, rej) => {
      emails.read((data) => {
        console.log(">> data", data)
        const email = Object.keys(data)[
          Math.floor(Math.random() * Object.values(data).length)
        ];
        console
        res(data[email]);
      });
    })

    console.log(">> email", email)

    // const getRandomCompany = await sendEmail();



  }

  await func()

  // setTimeout(() => {
  //   func()
  // },
  //   Math.random() * 100000
  // );

};

module.exports = sendEmailToCompanies;
