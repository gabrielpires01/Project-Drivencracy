import express from "express";
import { GetChoices, PostChoice }from "./Controllers/Choice.js";
import { GetPools, PostPool } from "./Controllers/Pool.js";

const app = express();
app.use(express.json());

app.post('/pool', PostPool)
app.get('/pool', GetPools)

app.post('/choice', PostChoice)
app.get('/pool/:id/choice', GetChoices)

export default app;