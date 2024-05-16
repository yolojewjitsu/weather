const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const app = express();
const port = 3000;

// Настройка CORS
app.use(cors());

// Ограничение запросов
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100 // ограничение на 100 запросов с одного IP за 15 минут
});

app.use(limiter);

app.get('/api/weather', async (req, res) => {
  try {
    const { lat = 55.7558, lon = 37.6176 } = req.query; // координаты Москвы по умолчанию
    const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'YourAppName/1.0 (yourname@example.com)' // Укажите вашу информацию
      }
    });
    const data = response.data;

    // Фильтрация данных для времени около 14:00
    const forecast = data.properties.timeseries.filter(ts => {
      const date = new Date(ts.time);
      const hours = date.getUTCHours();
      return hours === 11; // 14:00 по московскому времени (UTC+3)
    });

    res.json(forecast);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
module.exports = app;