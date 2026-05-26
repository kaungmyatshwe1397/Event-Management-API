import { Router } from "express";
import { AppDataSource } from "../database/data-source";
import { Ticket } from "../entities/ticket";
import { Concert } from "../entities/concert";
import { getLogger } from "../libs/logger";
import { validationMiddleware } from "../middlewares/validate";
import { reserveSchema } from "../libs/schema";

const router = Router();

router.post("/", validationMiddleware(reserveSchema), async (req, res) => {
  // user and concert id must include in request body
  const { userId, concertId } = req.body;
  const queryRunner = AppDataSource.createQueryRunner();

  // Connect a door for  data transaction and start to prevent race conditon
  await queryRunner.connect();
  await queryRunner.startTransaction();

  // Write all logic event that want in bundle write inside of this
  try {
    getLogger().info("Ticket reservation request received.");
    // Find and select the wanted concert by using concert id
    const selectedConcert = await queryRunner.manager.findOne(Concert, {
      where: { id: concertId },
    });
    // If there is no concert or concert have no ticket, return this
    if (!selectedConcert || selectedConcert.stock == 0) {
      await queryRunner.rollbackTransaction();
      return res.status(400).json({
        message: "There is no valid concerts or concert with valid tickets",
      });
    }
    // If concert is there and ticket is reserved , decrease ticket stock count from that concert
    selectedConcert.stock -= 1;

    // Update the concert state
    await queryRunner.manager.save(Concert, selectedConcert);
    // Create a new ticket for user for selectecd concert by using ticket entities
    await queryRunner.manager.save(Ticket, {
      userId: userId,
      concertId: concertId,
      status: "PENDING",
      category: "Basic",
      createAt: new Date(),
    });
    // The whole bundle process is success and do transaction commiting
    await queryRunner.commitTransaction();
    res.json({ message: "ticket is reserved." });
  } catch (error) {
    // Roll back error happen in one of the things (ALL or Nothing)
    await queryRunner.rollbackTransaction();
    // getLogger().warn("Reservation failed!!!");
    // res.status(500).json({ message: "Ticket reservation failed!!!" });
    throw error;
  } finally {
    // Leave from lock transaction
    await queryRunner.release();
  }
});

export default router;
