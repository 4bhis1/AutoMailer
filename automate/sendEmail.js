const { refererContent } = require("../config/emailTemplates");
const { log } = require("../utils/consoller");
const JsonDB = require("../utils/jsonB");
const { sendEmail } = require("../utils/mailer");

const sendEmailToCompanies = async (companyJsonInstance) => {
  log("Preparing to send emails....");

  const func = async () => {
    try {
      let company = await new Promise((res, rej) => {
        companyJsonInstance.read((data) => {
          try {
            const companyList =
              Object.keys(data)[
              Math.floor(Math.random() * Object.values(data).length)
              ];
            res(data[companyList]);
          } catch (err) {
            rej(`Error reading company list: ${err}`);
          }
        });
      });

      const emails = new JsonDB(company.companyName, {}, "companies");

      const email = await new Promise((res, rej) => {
        emails.read((data) => {
          let count = 0;

          const getEmail = () => {
            try {
              const email = Object.keys(data)[
                Math.floor(Math.random() * Object.values(data).length)
              ];
              res(data[email]);
            } catch (err) {
              if (count === 0) {
                count++;
                getEmail();  // Retry once
              } else {
                rej(`Error retrieving email: ${err}`);
              }
            }
          };

          getEmail();
        });
      });

      log(`${email?.name} && ${company.jobLink} && ${company.companyName} && ${email?.email}`);
      const completedCompany = new JsonDB(company.companyName, {}, "doneCompanies");

      completedCompany.read((data) => {
        emails.write((data) => {
          delete data[email.email];
          return data;
        });
        if (data[email.email]) {
          func();
        }
      });

      if (email?.name && company.jobLink && company.companyName && email?.email) {
        try {
          const { subject, content } = refererContent(email.name.split(" ")[0], company.jobLink, company.companyName);
          await sendEmail(email.email, subject, content, '/assets/Resume.pdf');

          completedCompany.write((data) => {
            return { ...data, [email.email]: true };
          });

          emails.write((data) => {
            delete data[email.email];
            return data;
          });

        } catch (err) {
          console.error(`Error sending email: ${err}`);
        }
      } else {
        func()
      }
    } catch (err) {
      console.error(`Error: ${err}`);
    }
  };

  await func();

  // Schedule next call with a delay to avoid overlap
  setInterval(async () => {
    try {
      await func();
    } catch (err) {
      console.error(`Error in scheduled email sending: ${err}`);
    }
  }, Math.random() * 1000000);  // Random interval as defined
};

module.exports = sendEmailToCompanies;
