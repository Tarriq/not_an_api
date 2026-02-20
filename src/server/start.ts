import app from "./index.js";

const PORT = Number(process.env.PORT);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API listening on port ${PORT}`);
});
