import { Router } from "express";
import { validationMiddleware } from "../middlewares/validate";
import { reserveSchema } from "../libs/schema";
import { reserveRateLimiter } from "../middlewares/rate-limit";
import { ReservationController } from "../controllers/reservation.controller";

const router = Router();

/**
 * @openapi
 * /reserves:
 *   post:
 *     summary: Reserve a concert ticket
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               concertId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Ticket reserved successfully
 *       409:
 *         description: Conflict - Concert don't exit or no remaining ticket for concert
 *       429:
 *         description: Too many requests
 */


// Route for creating ticket reservation
router.post("/",reserveRateLimiter,validationMiddleware(reserveSchema),ReservationController.createReservation);

export default router;
