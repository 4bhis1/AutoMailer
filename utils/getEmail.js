const fs = require("fs");
const path = require("path");

// Define the main directory path
const mainDir = path.join(__dirname, "./companies");

// Function to create the desired JSON structure
function createCompanyJSON() {
  // Read the main directory
  fs.readdir(mainDir, (err, companies) => {
    if (err) {
      console.error("Error reading main directory:", err);
      return;
    }

    const result = {};

    // Iterate over each company folder
    let processedCount = 0;
    companies.forEach((company) => {
      const companyDir = path.join(mainDir, company);
      const emailFilePath = path.join(companyDir, `${company}.txt`);

      // Read the email.txt file for the company
      fs.readFile(emailFilePath, "utf8", (err, emailContent) => {
        if (err) {
          console.error(`Error reading email for ${company}:`, err);
          processedCount++;
          if (processedCount === companies.length) {
            saveToFile(result);
          }
          return;
        }

        const emailFormat = emailContent.split("\n")[0].split("@")[1];

        // Add the company name and email content to the JSON object
        result[company] = [`careers@${emailFormat}`, `hr@${emailFormat}`];

        processedCount++;

        // If all companies are processed, save the result to a file
        if (processedCount === companies.length) {
          saveToFile(result);
        }
      });
    });
  });
}

function saveToFile(data) {
  const jsonFilePath = path.join(__dirname, "./company_emails.json");
  fs.writeFile(jsonFilePath, JSON.stringify(data, null, 2), "utf8", (err) => {
    if (err) {
      console.error("Error writing to JSON file:", err);
    } else {
      console.log("JSON saved successfully to", jsonFilePath);
    }
  });
}

// Execute the function
createCompanyJSON();
