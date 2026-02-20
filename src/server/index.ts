import express from 'express';
import apiRouter from '../routes/apiRouter.js';


const app = express();
app.use(express.json());

app.use((req, res, next) => {
  const userKey = req.header('x-api-key');
  const serverKey = process.env.API_ACCESS_KEY;

  if (userKey && userKey === serverKey) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized: Access Denied' });
  }
});

app.use("/", apiRouter)


export default app;