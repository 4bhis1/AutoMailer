const puppeteer = require("puppeteer");
const { fetchCompanyPeople } = require("./fetchPeopleEmail");
const { fakePromise } = require("../../utils/utils");

async function scrapeEmailFormats(page, companyName) {
  const searchQuery = `${companyName} email address format rocketreach`;

  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
    searchQuery
  )}`;

  await page.goto(searchUrl, { waitUntil: "networkidle2" });

  await page.waitForSelector("body");

  const emailFormats = await page.evaluate(() => {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const bodyText = document.body.innerText;

    // Match and collect all email-like patterns
    const emails = bodyText.match(emailRegex);

    // Return unique emails if found, otherwise an empty array
    return emails ? Array.from(new Set(emails)) : [];
  });

  return emailFormats;
}

function extractDomain(dataArray, companyName) {
  const potentialDomains = [];

  // Collect potential email domains from the data array
  for (let item of dataArray) {
    const domainMatch = item.match(
      /[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/
    );
    if (domainMatch && domainMatch[1]) {
      potentialDomains.push(domainMatch[1].toLowerCase());
    }
  }

  // Filter domains that match the company name
  const matchingDomains = potentialDomains.filter((domain) =>
    domain.includes(companyName.toLowerCase())
  );

  // Return the first matching domain if it exists
  if (matchingDomains.length > 0) {
    return matchingDomains[0];
  }

  return potentialDomains.length > 0 ? potentialDomains[0] : undefined;
}

const fetchCompanyDomain = async (company) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const domains = await scrapeEmailFormats(page, company);
  const companyDomain = extractDomain(domains, company);

  if (companyDomain) {
    await fakePromise();
    await fetchCompanyPeople(page, company, companyDomain);
  }

  await browser.close();
};

module.exports = {
  fetchCompanyDomain,
};
