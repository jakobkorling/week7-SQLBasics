// user input concatenated straight into the SQL string -- DO NOT do this
const result = await pool.query(
  `SELECT name, description FROM products WHERE category = '${req.query.category}' AND released = 1`,
);