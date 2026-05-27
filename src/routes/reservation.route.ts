import { Router } from "express";
import { validationMiddleware } from "../middlewares/validate";
import { reserveSchema } from "../libs/schema";
import { reserveRateLimiter } from "../middlewares/rate-limit";
import { ReservationController } from "../controllers/reservation.controller";

const router = Router();

// Route for creating ticket reservation
router.post("/",reserveRateLimiter,validationMiddleware(reserveSchema),ReservationController.createReservation);

export default router;
