const app = require("./app");
require("dotenv").config();
const port = process.env.port || 4000;
app.listen(port, () => {
  console.log(`app running on ${port}`);
});
