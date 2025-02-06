import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();

import playerStatistics from "./playerStatistics.js";
app.use("/playerStatistics", playerStatistics);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Express listening on port: " + PORT);
});
