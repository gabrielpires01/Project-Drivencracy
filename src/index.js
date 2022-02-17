import express from "express";
import { GetChoices, PostChoice, PostVote }from "./Controllers/Choice.js";
import { GetPoolResults, GetPools, PostPool } from "./Controllers/Pool.js";

const app = express();
app.use(express.json());

app.post('/pool', PostPool)
app.get('/pool', GetPools)
app.get('/pool/:id/choice', GetChoices)
app.get('/pool/:id/result', GetPoolResults)

app.post('/choice', PostChoice)
app.post('/choice/:id/vote', PostVote)

export default app;