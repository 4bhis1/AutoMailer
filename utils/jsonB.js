const fs = require("fs");
const path = require("path");

class JsonDB {
  static #data = null; // Static and private

  constructor(name, initialValue = [], db) {
    if (db) {
      this.filePath = path.join(`assets/${db}/`, `${name}.json`);
    } else {
      this.filePath = path.join(`assets/`, `${name}.json`);
    }
    this.queue = [];
    this.isProcessing = false;
    this.data;

    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify(initialValue, null, 2));
      JsonDB.#data = initialValue;
    }
  }

  async read(callback) {
    try {
      const data = await this.readFile();
      JsonDB.#data = data; // Update the static private data
      callback(data);
    } catch (err) {
      console.error("Error reading file:", err);
    }
  }

  async write(callback) {
    try {
      const data = await this.readFile();
      const updatedData = callback(data);
      await this.writeFile(updatedData);
      JsonDB.#data = updatedData; // Update the static private data
    } catch (err) {
      console.error("Error writing to file:", err);
    }
  }

  readFile() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.filePath, "utf-8", (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(data));
        }
      });
    });
  }

  writeFile(data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.filePath, JSON.stringify(data, null, 2), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = JsonDB;
