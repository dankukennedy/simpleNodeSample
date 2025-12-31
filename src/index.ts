import express from 'express';
import type{Application, Request, Response} from 'express';
import cors from 'cors';
import type { DotenvPopulateInput } from 'dotenv';
import dotenv from 'dotenv';
import userRoute from './route/userRoute.ts';
dotenv.config();

const app: Application = express();
app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:5173', // Your Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow cookies if needed
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => { res.send('API is running...');});// Get 

app.use('/api', userRoute);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
export interface DotenvConfigOutput {
  error?: Error;
  parsed?: DotenvPopulateInput;
}