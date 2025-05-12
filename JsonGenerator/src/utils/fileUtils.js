const fs = require('fs');
const path = require('path');

const ensureDirectoryExists = (dirPath) => {
  fs.mkdirSync(dirPath, { recursive: true });
};

const writeJsonToFile = (filePath, data) => {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, jsonData);
};

module.exports = {
  ensureDirectoryExists,
  writeJsonToFile
};