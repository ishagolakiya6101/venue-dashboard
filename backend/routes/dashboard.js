import express from "express";
import { pool } from "../db.js";

const router = express.Router();

/* =======================
   STATS ENDPOINT
======================= */
router.get("/stats", async (req, res) => {
  const { tab = "general", venue = "all", days = "all" } = req.query;

  let conditions = [];
  let values = [];

  // TAB FILTER
  if (tab !== "general") {
    values.push(tab);
    conditions.push(`t.type = $${values.length}`);
  }

  // VENUE FILTER  ✅
  if (venue !== "all") {
    values.push(Number(venue));
    conditions.push(`b.venue_id = $${values.length}`);
  }

  // DATE FILTER ✅ (NO values.push here)
  if (days !== "all") {
    conditions.push(
      `t.transaction_date >= CURRENT_DATE - INTERVAL '${days} days'`
    );
  }

  const whereClause = conditions.length
    ? "WHERE " + conditions.join(" AND ")
    : "";

  const query = `
    SELECT
      COUNT(DISTINCT m.member_id) FILTER (WHERE m.status='Active') AS active,
      COUNT(DISTINCT m.member_id) FILTER (WHERE m.status='Inactive') AS inactive,
      COUNT(*) FILTER (WHERE b.status='Confirmed') AS bookings,
      COUNT(*) FILTER (WHERE b.status='Cancelled') AS cancelled,
      COALESCE(SUM(t.amount) FILTER (WHERE t.status='Success'),0) AS revenue
    FROM transactions t
    JOIN bookings b ON t.booking_id = b.booking_id
    JOIN members m ON b.member_id = m.member_id
    ${whereClause}
  `;

  const result = await pool.query(query, values);
  res.json(result.rows[0]);
});



/* =======================
   REVENUE CHART ENDPOINT
======================= */
router.get("/revenue", async (req, res) => {
  const { tab = "general", venue = "all", days = "all" } = req.query;

  let conditions = [];
  let values = [];

  if (tab !== "general") {
    values.push(tab);
    conditions.push(`t.type = $${values.length}`);
  }

  if (venue !== "all") {
    values.push(Number(venue));
    conditions.push(`b.venue_id = $${values.length}`);
  }

  if (days !== "all") {
    conditions.push(
      `t.transaction_date >= CURRENT_DATE - INTERVAL '${days} days'`
    );
  }

  const whereClause = conditions.length
    ? "WHERE " + conditions.join(" AND ")
    : "";

  const query = `
    SELECT
      t.transaction_date,
      SUM(t.amount) AS revenue
    FROM transactions t
    JOIN bookings b ON t.booking_id = b.booking_id
    ${whereClause}
    GROUP BY t.transaction_date
    ORDER BY t.transaction_date
  `;

  const result = await pool.query(query, values);
  res.json(result.rows);
});


export default router;
