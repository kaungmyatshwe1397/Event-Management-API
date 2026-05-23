import express from "express";
import concertRoute from "./routes/concert.route";
import reservationRoute from "./routes/reservation.route";
import purchaseRoute from "./routes/purchase.route";
import "reflect-metadata";
import { AppDataSource } from "./database/data-source";
import "./cron-tasks/restock-unprchased-tickets";

const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello,World");
});

app.use("/concerts", concertRoute);
app.use("/reserves", reservationRoute);
app.use("/purchases",purchaseRoute);




AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed", err);
  });
