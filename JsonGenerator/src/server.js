require('dotenv').config();
const app = require('./app');

// Get the port number from .env file or use 3000 as default
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`View table contents at: http://localhost:${PORT}/table/your-table-name`);
});