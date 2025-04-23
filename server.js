const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// Direct Supabase connection string with encoded password (@@ → %40%40)
const pool = new Pool({
  user: "postgres",
  host: "db.uimqfvscwkckbxsrtlbg.supabase.co",
  database: "postgres",
  password: "Iamno1@@",
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

// Endpoint to execute SQL
app.post("/execute-sql", async (req, res) => {
  const { query } = req.body;

  try {
    const result = await pool.query(query);
    res.json({
      columns: result.fields.map(f => f.name),
      rows: result.rows,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
