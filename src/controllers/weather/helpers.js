const { ReplyKeyboard } = require("telegram-keyboard-wrapper");
const { BUTTONS } = require("../../../constants");
const axios = require("axios");
const config = require("dotenv").config();
const keys = config.parsed.API_KEYS;

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
  let userLatitude = ctx.update.message.location.latitude;
  let userLongitude = ctx.update.message.location.longitude;
  console.log(userLatitude);
  console.log(userLongitude);

  let response = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${userLatitude}&lon=${userLongitude}&appid=${keys}&lang=ru&units=metric`
  );
  let   kek  =   response.data

console.log(kek)

  displayWeather(ctx, response);
}

async function displayWeather(ctx, response) {
/*   console.log(response.data) */
  let weather = response.data;
  let data = `${weather.weather[0].description}:\n🌡 Температура: ${weather.main.temp} C° \n⚠ (чувст. как ${weather.main.feels_like} C°)\n🌪 Ветер: ${weather.wind.speed}км/час\n💧 Влажность: ${weather.main.humidity}%\n☁ Облачность: ${weather.clouds.all}`;
 await ctx.telegram.sendMessage(ctx.chat.id, data)
}

module.exports = {
  sendLocationKeyboard,
  getWeather,
};
