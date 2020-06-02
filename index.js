const bot = require("./src/bot");
const { initializeDB } = require("./src/lib/mongoose.connect");

async function startBot() {
  await initializeDB();
  await bot.use();
}
require("http")
  .createServer()
  .listen(process.env.PORT || 5000)
  .on("request", function (req, res) {
    res.end("");
  });

startBot().catch((err) => console.log(err));
