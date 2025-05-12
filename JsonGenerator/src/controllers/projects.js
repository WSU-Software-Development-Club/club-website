const db = require('../config/db');

exports.getProjectList = async (req, res) => {
  try {
    // Query the table contents
    const result = await db.query(`SELECT * FROM projects`);
    
    res.json({
      status: 'success',
      table: 'projects',
      rowCount: result.rowCount,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: `Failed to fetch table contents.`,
      error: error.message
    });
  }
};


exports.getProject = async (req, res) => {
  const { projectId } = req.params;

  try {
    // Query the specific project by ID
    const result = await db.query(
      `SELECT * FROM projects WHERE id = $1`,
      [projectId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
      });
    }

    res.json({
      status: 'success',
      rowCount: result.rowCount,
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Database query failed',
      details: error.message
    });
  }
};