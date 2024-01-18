import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./src/routes";

import { config } from "dotenv";
config();

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Use routes
app.use("/api", userRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
