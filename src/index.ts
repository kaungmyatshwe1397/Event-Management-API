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
import { Server } from "http";
import { stopCrontask } from "./cron-tasks/restock-unprchased-tickets";

const app = express();
const port = 3000;
const swaggerDocument = YAML.load(path.join(__dirname, "../docs/swagger.yaml"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello,World");
});

app.use(correlationIdMiddleware);

app.use("/users", userRoute);
app.use("/concerts", concertRoute);
app.use("/reserves", reservationRoute);
app.use("/purchases", purchaseRoute);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(errorHandlingMiddleware);

let server: Server;
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
    server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed", err);
    // Close if faile to connect database at the first place
    process.exit(1);
  });

// Gracefully shuting down the server by using SIGTERM or signal 15
process.on("SIGTERM", () => {
  console.log("SIGTERM RECEIVED.Shutting down gracefully...");

  if (!server) {
    process.exit(0);
  }

  // Closing cron tasks before sever closing
  stopCrontask();

  // Close server from receiving new requests
  server.close(async (err) => {
    // Server.close is call back time , so it return  error by keeping inside a variable
    // Prevent crashing
    // Use this error to use log
    if (err) {
      console.error("Error closing on HTTP server", err);
    } else {
      console.log("HTTP sever closed.");
    }

    // AppDataSource.destory() is modern Promise pattern (async/await)
    // Don't keep inside variable, instead of that thorw the error leads to crashing if not catch
    // Need to use try catch
    try {
      // Close the database asynchronous
      await AppDataSource.destroy();
      console.log("Database connection closed.");
      // If server had errs , database also exit with (1)
      process.exit(err ? 1 : 0);
    } catch (dbErr) {
      console.error("Error on closing database connecton", dbErr);
      process.exit(1);
    }
  });

  // Timout for gracefull shutdown and if fail forced shutdown
  setTimeout(() => {
    console.log("Forced shut down after 10sec.");
    process.exit(1);
  }, 10000).unref();
});
