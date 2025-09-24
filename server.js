import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import imageRouter from './routes/imageRoutes.js';
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoutes.js';

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(cors())
await connectDB();


app.use('/api/image',imageRouter)
app.use('/api/user',userRouter)


app.get('/', (req, res) => res.send('Hello from Express!'));



app.listen(PORT,() => console.log("server running on port " + PORT));

