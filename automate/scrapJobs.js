const puppeteer = require("puppeteer");
const { fakePromise } = require("../utils/utils");

const scrollToBottom = async (page) => {
  await page.evaluate(async () => {
    const container = document.querySelector(
      ".scaffold-layout__list-container"
    );
    if (!container) return; // Exit if container doesn't exist
    let previousHeight = container.scrollHeight;

    console.log("🚀 ~ Current container height:", previousHeight);

    while (true) {
      container.scrollTop = container.scrollHeight; // Scroll to the bottom
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for new content to load
      if (container.scrollHeight === previousHeight) break; // Break if no new content
      previousHeight = container.scrollHeight; // Update previous height
    }
  });
};

// Function to login and scrape jobs
async function startScraping(companyInstance) {
  const browser = await puppeteer.launch({
    headless: false, // Keep headless false to see the browser; set to true for background
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage();

  // Step 1: Login to LinkedIn
  await page.goto("https://www.linkedin.com/login", {
    waitUntil: "networkidle2",
  });

  // Enter email and password, then submit login form
  await page.type("#username", process.env.USERNAME);
  await page.type("#password", process.env.PASSWORD);
  await page.click('button[type="submit"]');

  // Step 2: Wait for a specific element to confirm successful login
  try {
    await page.waitForSelector(".global-nav__me-photo", { timeout: 10000 }); // Wait for profile image to appear
    console.log("Logged in successfully!");
  } catch (error) {
    console.log("Login failed or took too long:", error);
    await browser.close();
    return;
  }

  // Step 4: Scrape job listings
  const scrapeJobs = async () => {
    let jobs = {}; // Store all job data

    for (let index = 0; index <= 10; index++) {
      try {
        const jobSearchUrl = `https://www.linkedin.com/jobs/search/?currentJobId=4044942019&distance=25&f_CR=102713980&f_E=3&f_F=eng%2Cit&f_I=4%2C96%2C6&f_JT=F&f_T=9%2C25194%2C100&geoId=92000000&keywords=javascript&origin=JOB_SEARCH_PAGE_KEYWORD_AUTOCOMPLETE&refresh=true&start=${
          index * 7
        }`; // Note: Adjusted for more jobs per page

        console.log("Navigating to job search URL...", jobSearchUrl);
        await page.goto(jobSearchUrl, { waitUntil: "load", timeout: 60000 });
        console.log("Successfully navigated to job search URL");

        // Wait for the job listings to load
        await page.waitForSelector(".jobs-search-results__list-item");

        // Scroll to the bottom of the job listing container
        await scrollToBottom(page);

        // Scrape job details
        const newJobs = await page.evaluate(() => {
          const jobElements = document.querySelectorAll(
            ".jobs-search-results__list-item"
          );
          const jobData = {};

          jobElements.forEach((job) => {
            const jobTitle = job
              .querySelector(".job-card-list__title")
              ?.innerText.trim();
            const companyName = job
              .querySelector(".job-card-container__primary-description")
              ?.innerText.trim();
            const location = job
              .querySelector(".job-card-container__metadata-item")
              ?.innerText.trim();
            const jobLink = job
              .querySelector(".job-card-list__title")
              ?.getAttribute("href");
            const jobId = job.getAttribute("data-job-id");
            const formattedJobLink = jobLink
              ? `https://www.linkedin.com${jobLink.split("?")[0]}`
              : "";
            const referralId = jobLink
              ? new URL(`https://www.linkedin.com${jobLink}`).searchParams.get(
                  "currentJobId"
                )
              : null; // Extract referral ID from job link

            console.log(">>>", {
              jobTitle,
              companyName,
              location,
              jobLink: formattedJobLink,
              jobId,
              referralId,
              jobDescription: "", // Placeholder for job description
            });
            // Push the job data to the array
            if (jobTitle && companyName && location && jobLink) {
              jobData[`${companyName}-${jobTitle}`] = {
                jobTitle,
                companyName,
                location,
                jobLink: formattedJobLink,
                jobId,
                referralId,
                jobDescription: "", // Placeholder for job description
              };
            }

            console.log(
              "🚀 ~ file: scrapJobs2.js:124 ~ jobElements.forEach ~ jobLink:",
              jobLink
            );
          });

          return jobData;
        });

        jobs = { ...jobs, ...newJobs };

        console.log(
          `Fetched ${Object.values(newJobs).length} jobs from page ${
            index + 1
          }.`
        );
        console.log("Current Jobs:", newJobs);

        for (const [key, job] of Object.entries(newJobs)) {
          console.log("🚀 ~ file: scrapJobs2.js:155 ~ scrapeJobs ~ key:", key);

          await page.goto(job.jobLink, { waitUntil: "load", timeout: 60000 });

          const jobDescription = await page.evaluate(() => {
            const descriptionElement = document.querySelector(
              ".jobs-description__content.jobs-description-content"
            );

            if (descriptionElement) {
              return descriptionElement.innerText.trim();
            }

            return null;
          });

          console.log("Job Description:", jobDescription);

          await fakePromise();
          jobs[key].jobDescription = jobDescription;
        }

        companyInstance.write((data) => {
          data = { ...data, ...jobs };
          return data;
        });

        await fakePromise();
      } catch (err) {
        console.log(">> Error:", err);
      }
    }

    console.log("Total jobs scraped:", Object.keys(jobs).length);
    console.log("All Scraped Jobs:", jobs);
  };

  await scrapeJobs();

  setInterval(async () => {
    console.log("Navigating to the LinkedIn jobs page again...");
    await scrapeJobs();
  }, 2 * 60 * 60 * 1000);
}

module.exports = {
  startScraping,
};