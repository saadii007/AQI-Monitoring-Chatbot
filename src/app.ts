import express from "express";
import dotenv from "dotenv";
import aqiRoutes from "./routes/aqiRoutes";
import chatRoutes from "./routes/chatRoutes";

dotenv.config();

const app = express();

app.use(express.json({ limit: "1mb" }));

app.use((req, res, next) => {
  console.log("Incoming Request:", req.method, req.url);
  console.log("Body Received:", req.body);
  next();
});

app.use("/aqi", aqiRoutes);
app.use("/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("AQI API and Chatbot are running 🚀");
});

export default app;
