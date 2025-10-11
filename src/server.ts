import dotenv from "dotenv";
dotenv.config();

import "./config/db";
import app from "./app";

console.log("🔑 API Key:", process.env.OPENWEATHER_API_KEY);
console.log("🤖 GROQ Key:", process.env.GROQ_API_KEY ? "Loaded ✅" : "Missing ❌");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🌍 AQI API running at http://localhost:${PORT}`);
});
