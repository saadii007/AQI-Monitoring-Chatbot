# AQI Monitoring & Chatbot API

A **RESTful** API that fetches **real-time Air Quality (AQI)** data for Indian cities, stores it in **PostgreSQL**, and provides both REST endpoints and an **AI-powered LLM chatbot interface** for natural language queries.

---

## Tech Stack

- **Backend:** Node.js, Express.js, TypeScript  
- **Database:** PostgreSQL (Dockerized)  
- **External API:** OpenWeather Air Pollution API  
- **AI Model:** Groq (Llama-3.1)  
- **Tools:** Docker Desktop, Postman, dotenv  

---

## Features

✅ Fetch real-time AQI data for any city  
✅ Store AQI readings in PostgreSQL  
✅ RESTful API with `/aqi/:city` endpoint  
✅ JWT Authentication and Redis caching  
✅ AI Chatbot (LLM) that answers natural language queries  
✅ Dockerized setup for full-stack deployment  

---

### Screenshot

<img width="800" height="600" alt="Image" src="https://github.com/user-attachments/assets/55dafa5b-f2ac-4584-9f48-3782e4e8d408" />

## ⚙️ Setup Instructions

### 1️⃣ Clone the repo
```bash
git clone https://github.com/<your-username>/aqi-api.git
cd aqi-api
```
### 2️⃣ Install dependencies
```bash
npm install
```
### 4️⃣ Run PostgreSQL + API (Docker)
```bash
docker-compose up --build
```
### Example Chat Request
POST /chat
```json
{
  "message": "How is the air quality in Mumbai?"
}
```

Response:
```json
{
  "city": "Mumbai",
  "aqi": 3,
  "level": "Moderate",
  "reply": "The air in Mumbai is moderate — sensitive groups may want to limit outdoor activities."
}
```
### 🐳 Docker Commands
```bash
docker-compose up --build      # start
docker ps                      # list containers
docker exec -it aqi_postgres psql -U aqiuser -d aqidb  # connect to DB
```
