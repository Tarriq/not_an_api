import express from 'express';
import apiRouter from '../routes/router.js';
import { verifyOidcMiddleware } from '../middleware/auth.js';


const app = express();
app.use(verifyOidcMiddleware);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


app.use("/", apiRouter)


export default app;