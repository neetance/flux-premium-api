import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import getPremium from './premiumCalculator';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use('/premium', getPremium);

app.listen(port, () => {
   console.log(`Server running on port ${port}`);
});
