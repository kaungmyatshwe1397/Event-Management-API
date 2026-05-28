import express from "express";
import userRoute from "./routes/user.route";
import concertRoute from "./routes/concert.route";
import reservationRoute from "./routes/reservation.route";
import purchaseRoute from "./routes/purchase.route";
import "reflect-metadata";
import { AppDataSource } from "./database/data-source";
import "./cron-tasks/restock-unprchased-tickets";
import { correlationIdMiddleware } from "./middlewares/correlationId";
import { errorHandlingMiddleware } from "./middlewares/errorHandling";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

const app = express();
const port = 3000;
const swaggerDocument = YAML.load(path.join(__dirname, "../docs/swagger.yaml"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello,World");
});

app.use(correlationIdMiddleware);

app.use("/users",userRoute);
app.use("/concerts", concertRoute);
app.use("/reserves", reservationRoute);
app.use("/purchases",purchaseRoute);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(errorHandlingMiddleware);





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
