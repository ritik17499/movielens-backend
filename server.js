const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const dns = require("dns");

// Resolve Supabase hostname to IPv4 to avoid IPv6 errors on Render
dns.lookup("db.uimqfvscwkckbxsrtlbg.supabase.co", { family: 4 }, (err, address) => {
  if (err) throw err;

  const pool = new Pool({
    host: address,
    port: 5432,
    user: "postgres",
    password: "Iamno1@@",
    database: "postgres",
    ssl: { rejectUnauthorized: false }
  });

  const app = express();
  app.use(cors());
  app.use(express.json());

  // SQL execution endpoint
  app.post("/execute-sql", async (req, res) => {
    const { query } = req.body;

    try {
      const result = await pool.query(query);
      res.json({
        columns: result.fields.map(f => f.name),
        rows: result.rows
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`✅ Backend running at http://localhost:${PORT}`);
  });
});
