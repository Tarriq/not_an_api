import express from 'express';
import storyRoutes from '../routes/storyRoutes.js';
import saveRoutes from '../routes/saveRoutes.js';
import categoryRoutes from '../routes/categoryRoutes.js';

const app = express();
app.use(express.json());

// Mount the stories route
app.use('/stories', storyRoutes);
app.use('/save', saveRoutes);
app.use('/categories', categoryRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;