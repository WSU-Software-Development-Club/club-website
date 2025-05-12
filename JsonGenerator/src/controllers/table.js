const db = require('../config/db');

exports.getTableContents = async (req, res) => {
  const { tableName } = req.params;
  
  // This list contains allowed table names for security
  const allowedTables = [
    'clubMemberships',
    'clubRoles',
    'memberImages',
    'members',
    'projImages',
    'projMembership',
    'projects',
  ];
  
  // Check if the requested table is allowed
  if (!allowedTables.includes(tableName)) {
    return res.status(403).json({
      status: 'error',
      message: 'Access to this table is not allowed'
    });
  }

  try {
    // Query the table contents
    const result = await db.query(`SELECT * FROM "${tableName}"`);
    
    res.json({
      status: 'success',
      table: tableName,
      rowCount: result.rowCount,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: `Failed to fetch table contents from "${tableName}"`,
      error: error.message
    });
  }
};