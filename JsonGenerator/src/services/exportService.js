const path = require('path');
const pool = require('../config/db');
const { ensureDirectoryExists, writeJsonToFile } = require('../utils/fileUtils');

const exportTableToJson = async (tableName) => {
  try {
    // Query the database
    const result = await pool.query(`SELECT * FROM ${tableName}`);
    
    // Define the output file path
    const outputDir = path.join(__dirname, '../../output');
    const outputPath = path.join(outputDir, `${tableName}.json`);
    
    // Ensure the output directory exists
    ensureDirectoryExists(outputDir);
    
    // Write the JSON file
    writeJsonToFile(outputPath, result.rows);
    
    return {
      success: true,
      message: `JSON file created successfully at ${outputPath}`,
      recordCount: result.rows.length,
      filePath: outputPath
    };
  } catch (error) {
    throw new Error(`Error exporting table to JSON: ${error.message}`);
  }
};

module.exports = {
  exportTableToJson
};