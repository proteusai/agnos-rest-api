import express from "express";
import cors from "cors";
import routes from "@routes";
import deserializeUser from "@middleware/deserializeUser";

const app = express();

app.use(cors());
app.use(express.json());
app.use(deserializeUser);
routes(app);

export default app;
