import { Router } from "express";
import axios from "axios";
import { getCityAQI } from "../services/aqiService";

console.log("🧠 chatRoutes.ts loaded");

const router = Router();

router.get("/test", (req, res) => {
  res.json({ message: "✅ Chat route is working" });
});

router.post("/", async (req, res) => {
  console.log("🔥 POST /chat triggered");
  const { message } = req.body;

  if (!message) {
    console.log("⚠️ No message in body");
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    console.log("📨 Received message:", message);

    const match = message.match(/in\s+([A-Za-z\s]+)/i);
    const city = match ? match[1].trim() : "Delhi";
    console.log("🏙️ City identified:", city);

    const aqiData = await getCityAQI(city);
    console.log("🌫️ AQI data fetched for", city, aqiData.aqi);

    const prompt = `
User asked: "${message}"
Here is the air quality data for ${city}:
AQI: ${aqiData.aqi}
Level: ${aqiData.level}
Components: ${JSON.stringify(aqiData.components)}
Please reply in 1-2 sentences describing the air quality.
`;

    const aiResponse = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      }
    );

    const reply = aiResponse.data.choices[0].message.content;
    console.log("🤖 LLM reply:", reply);

    res.json({
      city,
      aqi: aqiData.aqi,
      level: aqiData.level,
      reply,
    });
  } catch (err: any) {
    console.error("❌ Chat route error:", err.message);
    res.status(500).json({ error: "Chatbot failed", details: err.message });
  }
});

export default router;