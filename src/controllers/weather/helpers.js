const { ReplyKeyboard } = require("telegram-keyboard-wrapper");
const { BUTTONS } = require("../../../constants");
const axios = require("axios");
const config = require("dotenv").config();
const keys = config.parsed.API_KEYS;
const url = config.parsed.OPENWEATHER_API_URL;

const sendLocationKeyboard = new ReplyKeyboard()
  .addRow({
    text: "🧭 Send my location",
    request_location: true,
    one_time_keyboard: true,
  })
  .addRow({
    text: BUTTONS.BACK,
  });

async function getWeather(ctx) {
  let response = await axios.get(
    `${url}lat=${ctx.update.message.location.latitude}&lon=${ctx.update.message.location.longitude}&appid=${keys}&lang=ru&units=metric`
  );
  displayWeather(ctx, response);
}

async function displayWeather(ctx, response) {
  let data = `${response.data.weather[0].description}:\n🌡 Температура: ${response.data.main.temp} C° \n⚠ (чувст. как ${response.data.main.feels_like} C°)\n🌪 Ветер: ${response.data.wind.speed}км/час\n💧 Влажность: ${response.data.main.humidity}%\n☁ Облачность: ${response.data.clouds.all}`;
  await ctx.telegram.sendMessage(ctx.chat.id, data);
}

module.exports = {
  sendLocationKeyboard,
  getWeather,
};
