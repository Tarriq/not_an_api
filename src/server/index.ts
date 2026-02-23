import express from 'express';
import apiRouter from '../routes/apiRouter.js';
import { validateApiKey } from '../middleware/auth.js';


const app = express();
app.use(express.json());

app.use(validateApiKey);

app.use("/", apiRouter)


export default app;