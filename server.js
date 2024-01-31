const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const app = require("./app");
const port = process.env.PORT || 3001;

const DB = process.env.DATA_BASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

async function connectToDatabase() {
  try {
    await mongoose.connect(DB);
    console.log(`DB is connected`);
  } catch (error) {
    console.error(`Error connecting to the database: ${error}`);
  }
}

connectToDatabase();

app.listen(port, () => {
  console.log(`App running at port ${port}`);
});
