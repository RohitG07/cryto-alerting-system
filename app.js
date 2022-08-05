const express = require("express");
const app = express();

require("dotenv").config();
require("express-async-errors");
const cors = require("cors");
const rateLimiter = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");

const authenticationRouter = require("./routes/authenticationRoutes");
const alertRouter = require("./routes/alertRoutes");

const { authenticateUser } = require("./middlewares/authentication");
const notFoundMiddleware = require("./middlewares/not-found");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const connectDB = require("./db/connect");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 60 * 1000,
    max: 600
  })
);
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(cors());
app.use(express.json());

app.use("/api/auth", authenticationRouter);
app.use("/api/alerts", authenticateUser, alertRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
async function startServer() {
  try {
    await connectDB(process.env.MONGO_CONNECTION_URL);
    app.listen(port, () => {
      console.log("Server listening..");
    });
  } catch (err) {
    console.log(err);
  }
}

startServer();
