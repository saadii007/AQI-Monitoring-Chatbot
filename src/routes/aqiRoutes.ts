import { Router } from "express";
import { getCityAQI } from "../services/aqiService";

const router = Router();

router.get("/:city", async (req, res) => {
  try {
    const city = req.params.city;
    const data = await getCityAQI(city);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
