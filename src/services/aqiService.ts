import axios from "axios";
import pool from "../config/db";
import redisClient from "../config/redis";

const API_KEY = process.env.OPENWEATHER_API_KEY;

export async function getCityAQI(city: string) {
  try {

    const cached = await redisClient.get(city.toLowerCase());
    if (cached) {
      console.log("Cache hit for", city);
      return JSON.parse(cached);
    }

    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
    const geoResponse = await axios.get(geoUrl);
    const { lat, lon } = geoResponse.data[0];

    const airUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    const airResponse = await axios.get(airUrl);

    const data = airResponse.data.list[0];
    const aqi = data.main.aqi;
    const level =
      aqi === 1 ? "Good" :
      aqi === 2 ? "Fair" :
      aqi === 3 ? "Moderate" :
      aqi === 4 ? "Poor" : "Very Poor";

    const result = {
      city,
      aqi,
      level,
      components: data.components
    };

    await pool.query(
      `INSERT INTO aqi_readings (city, aqi, level, co, no2, o3, so2, pm2_5, pm10, nh3)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        city,
        aqi,
        level,
        data.components.co,
        data.components.no2,
        data.components.o3,
        data.components.so2,
        data.components.pm2_5,
        data.components.pm10,
        data.components.nh3
      ]
    );

    await redisClient.setEx(city.toLowerCase(), 300, JSON.stringify(result));

    return result;

  } catch (error: any) {
    console.error("❌ Error fetching AQI data:", error.message);
    throw new Error("Failed to fetch AQI data");
  }
}
