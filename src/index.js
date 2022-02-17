import express from "express";
import { GetPools, PostPool } from "./Controllers/Pool.js";

const app = express();
app.use(express.json());

app.post('/pool', PostPool)
app.get('/pool', GetPools)

export default app;