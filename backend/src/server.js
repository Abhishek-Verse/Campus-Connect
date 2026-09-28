import 'dotenv/config';
import app from './app.js';
import { env } from './config/env.js';

const PORT = env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
