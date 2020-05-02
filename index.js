const bot = require("./src/bot");
const { initializeDB } = require("./src/lib/mongoose.connect");

async function startBot() {
  await initializeDB();
  await bot.use();
}
startBot().catch((err) => console.log(err));
