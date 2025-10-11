import axios from "axios";
import pool from "../config/db";

const API_KEY = process.env.OPENWEATHER_API_KEY;

export async function getCityAQI(city: string) {
  console.log("🔑 API Key in container:", process.env.OPENWEATHER_API_KEY);
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    const geoResponse = await axios.get(geoUrl);
    const { lat, lon } = geoResponse.data[0];

    const airUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const airResponse = await axios.get(airUrl);

    const data = airResponse.data.list[0];
    const aqi = data.main.aqi;
    const level =
      aqi === 1 ? "Good" :
      aqi === 2 ? "Fair" :
      aqi === 3 ? "Moderate" :
      aqi === 4 ? "Poor" : "Very Poor";

    await pool.query(
      `INSERT INTO aqi_readings (city, aqi, level, co, no2, o3, so2, pm2_5, pm10, nh3)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [city, aqi, level,
       data.components.co,
       data.components.no2,
       data.components.o3,
       data.components.so2,
       data.components.pm2_5,
       data.components.pm10,
       data.components.nh3]
    );

    return { city, aqi, level, components: data.components };

  } catch (error: any) {
    console.error("Error fetching AQI data:", error.message);
    throw new Error("Failed to fetch AQI data");
  }
}