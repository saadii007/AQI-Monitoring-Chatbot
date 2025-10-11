import pool from "../config/db";
import { Router } from "express";
import { getCityAQI } from "../services/aqiService";

const router = Router();

router.get("/history/:city", async (req, res) => {
  try {
    const city = req.params.city;
    const result = await pool.query(
      "SELECT * FROM aqi_readings WHERE city = $1 ORDER BY id DESC LIMIT 10",
      [city]
    );
    
    res.json({
      city,
      count: result.rows.length,
      data: result.rows
    });
  } catch (err: any) {
    console.error("Error fetching history:", err.message);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

router.get("/test", (req, res) => {
  res.json({ message: "AQI API is working!" });
});

router.get("/:city", async (req, res) => {
  try {
    const city = req.params.city;
    const result = await getCityAQI(city);

    res.json(result);
  } catch (err: any) {
    console.error("Error in AQI route:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;