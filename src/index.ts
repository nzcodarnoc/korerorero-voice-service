import * as dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import { PORT } from "./utils";
import cacheController from "./controllers/cache-controller";
import bodyParser from "body-parser";

dotenv.config();

const app = express();

app.use(helmet());
app.use(helmet.xssFilter());
app.disable("x-powered-by");
app.use(express.json());
app.use(bodyParser.json());

// ANCHOR /
app.get("/", (_req, res) => {
  res.send("OK. Speech service");
});

// ANCHOR /request
app.post("/request-speech", cacheController);

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
