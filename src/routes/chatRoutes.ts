import { Router } from "express";
import axios from "axios";
import { getCityAQI } from "../services/aqiService";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const match = message.match(/in\s+([A-Za-z\s]+)/i);
    const city = match ? match[1].trim() : "Delhi";

    if (!city) {
      return res.status(400).json({ error: "City name is required" });
    }

    console.log(`🗺️  Extracted city: ${city}`);

    const aqiData = await getCityAQI(city);

    const prompt = `
User asked: "${message}"
Here is the air quality data for ${city}:
AQI: ${aqiData.aqi}
Level: ${aqiData.level}
Components: ${JSON.stringify(aqiData.components, null, 2)}
Reply in 1-2 sentences in a helpful, conversational tone.
`;

    const aiResponse = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      }
    );

    const reply = aiResponse.data.choices?.[0]?.message?.content || "No reply generated.";

    res.json({
      city,
      aqi: aqiData.aqi,
      level: aqiData.level,
      reply,
    });

  } catch (err: any) {
    console.error("💥 Chat route error:", err.response?.data || err.message);
    res.status(500).json({
      error: "Chatbot failed",
      details: err.response?.data || err.message,
    });
  }
});

export default router;
