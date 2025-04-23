const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// Render-friendly Supabase connection using Transaction Pooler (IPv4-compatible)
const pool = new Pool({
  connectionString: "postgresql://postgres:Iamno1%40%40@aws-0-us-east-1.pooler.supabase.com:6543/postgres",
  ssl: {
    rejectUnauthorized: false
  }
});

// Endpoint to execute SQL queries
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

// Start server on Render-provided port or fallback to 4000 for local dev
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
