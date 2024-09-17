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

// Use routes
app.use("/api", require("./routes/index.routes"));

const PORT = process.env.PORT || 9090;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
