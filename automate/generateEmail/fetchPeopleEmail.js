const JsonDB = require("../../utils/jsonB");
const { fakePromise, getEmail } = require("../../utils/utils");

const fetchCompanyPeople = async (page, company, companyDomain) => {
  const query = `site:linkedin.com/in ${company} people india profile`;

  for (let index = 0; index < 4; index++) {
    try {
      await page.goto(
        `https://www.google.com/search?q=${query}&start=${10 * (index + 1)}`,
        { waitUntil: "networkidle2" }
      );

      // Wait for the content to load
      await page.waitForSelector("div.MjjYud");

      // Fetch the required data
      let people = await page.evaluate(() => {
        const peopleElements = document.querySelectorAll("div.MjjYud");
        let peopleData = [];

        peopleElements.forEach((person) => {
          const nameElement = person.querySelector("h3.LC20lb");
          let name = nameElement ? nameElement.innerText : void 0;

          if (name) {
            const descriptionElement = person.querySelector("div.VwiC3b");
            const description = descriptionElement
              ? descriptionElement.innerText
              : void 0;

            // Store the data
            peopleData.push({ name, description });
          }
        });

        return peopleData;
      });

      const peopleArray = people.reduce((acc, doc) => {
        let name = doc.name.split("-")[0].trim();

        const match = name.match(
          /^([A-Za-zÀ-ÖØ-öø-ÿ]+(?:\s[A-Za-zÀ-ÖØ-öø-ÿ]+)*)/
        );

        if (match) {
          name = match[1];
        }

        const email = getEmail(name, companyDomain);
        acc[email] = {
          name,
          description: doc.description,
          email,
        };

        return acc;
      }, {});

      await new Promise((res) => {
        const companynameJson = new JsonDB(company, {}, "companies");

        companynameJson.write((data) => {
          return { ...data, ...peopleArray };
        });

        res();
      });
    } catch (err) {
      console.log(">> err", err);
    }

    await fakePromise();
  }
};

module.exports = {
  fetchCompanyPeople,
};
