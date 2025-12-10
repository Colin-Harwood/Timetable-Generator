import express from "express"

const app = express();

app.use(express.json());

//routes import
import moduleRouter from './routes/module.route.js';

app.use("api/v1/modules", moduleRouter);

export default app;