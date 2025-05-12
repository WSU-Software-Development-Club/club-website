const db = require('../config/db');

exports.getMemberList = async (req, res) => {
  try {
    // Query the table contents
    const result = await db.query(`SELECT * FROM members`);
    
    res.json({
      status: 'success',
      table: 'members',
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

exports.getMember = async (req, res) => {
  const { memberId } = req.params;

  try {
    // Query the specific member by ID
    const result = await db.query(
      `SELECT * FROM members WHERE id = $1`,
      [memberId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Member not found'
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