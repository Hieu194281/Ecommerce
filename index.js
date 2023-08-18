import express from 'express';
import { dbConnect } from './configs/dbConnect.js';
import dotenv from 'dotenv';
import authRouter from './routes/authRoutes.js';
import bodyParser from 'body-parser';
import { errorHandler, notFound } from './middlewares/errorHandler.js';

const app = express();
dotenv.config();
const PORT = process.env.PORT || 4000;
dbConnect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api/user', authRouter);
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running in port kk ${PORT}`);
});
