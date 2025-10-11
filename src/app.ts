import express from "express";
import dotenv from "dotenv";
import aqiRoutes from "./routes/aqiRoutes";
import chatRoutes from "./routes/chatRoutes";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/aqi", aqiRoutes);

console.log("✅ Chat routes loaded:", typeof chatRoutes);

app.use("/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("AQI API and Chatbot are running 🚀");
});


export default app;