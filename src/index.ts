import express from "express";
import concertRoute from "./routes/concert.route";
import reservationRoute from './routes/reservation.route';
import 'reflect-metadata';
import { AppDataSource } from "./database/data-source";

const app = express();
const port = 3000;

app.get('/',(req,res)=>{
    res.send('Hello,World');
})

app.use('/concerts',concertRoute);

app.use('/reserves',reservationRoute);

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected')
    app.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  })
  .catch((err) => {
    console.error('Database connection failed', err)
  })