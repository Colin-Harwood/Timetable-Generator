import express from "express"

const app = express();

app.use(express.json());

//routes import
import moduleRouter from './routes/module.route.js';

app.get("/test", (req, res) => {
    res.send("Server is alive!");
});

app.use("/api/v1/modules", moduleRouter);

export default app;