const fs = require("fs");
const logFile = "message_history.txt";

const checkFileExistsAndCreate = (file) => {
  if (!fs.existsSync(file)) {
    fs.writeFile(file, "", (err) => {
      if (err) {
        console.error("Error creating the log file:", err);
      }
    });
  }
};

function logger(message) {
  console.log(message);
  checkFileExistsAndCreate(logFile);
  fs.appendFile(logFile, message + "\n", (err) => {
    if (err) {
      console.error("Error writing to the log file:", err);
    }
  });
}

module.exports = { logger };
