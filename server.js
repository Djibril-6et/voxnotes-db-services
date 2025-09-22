const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db.config");
const cors = require("cors");

dotenv.config();
const app = express();

// Middleware
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to the database
connectDB();

const User = require('./models/user.model');

// Créer les index d'unicité
async function createIndexes() {
  try {
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ username: 1 }, { unique: true });
    console.log("Index d'unicité créés avec succès");
  } catch (error) {
    console.log("Index déjà existants ou erreur:", error.message);
  }
}
createIndexes();

// Use routes
app.use("/api", require("./routes/index.routes"));

const PORT = process.env.PORT || 9090;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
