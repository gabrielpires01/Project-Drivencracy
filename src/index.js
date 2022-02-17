import express from "express";
import { PostPool } from "./Controllers/Pool.js";

const app = express();
app.use(express.json());

app.post('/pool', PostPool)

export default app;