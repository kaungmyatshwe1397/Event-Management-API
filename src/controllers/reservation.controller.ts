import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Ticket } from "../entities/ticket";
import { Concert } from "../entities/concert";
import { getLogger } from "../libs/logger";
import { ConflictError } from "../libs/errorClasses";

// Instead of using functions create class and use it for preventing multilple functions importing in route
// Use static so Route can use this function wihtout requiring to create new Obj and can save memory
export class ReservationController {
  static async createReservation(req: Request, res: Response) {
    // user and concert id must include in request body
    const { userId, concertId, quantity } = req.body;
    const queryRunner = AppDataSource.createQueryRunner();

    // Connect a door for  data transaction and start to prevent race conditon
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // Write all logic event that want in bundle write inside of this
    try {
      getLogger().info("Ticket reservation request received.");

      // Use atomic update for ticket reservation in DB not in JS math with fetch,calculate and upate
      const updateConcertTicketStock = await queryRunner.manager
        .createQueryBuilder()
        .update(Concert)
        .set({ stock: () => `stock - ${quantity}` })
        .where("id=:id AND stock >= :quantity", {
          id: concertId,
          quantity: quantity,
        })
        .execute();

      if (updateConcertTicketStock.affected == 0) {
        throw new ConflictError("No Available tickets or Concerts.");
      }

      // Create empty ticket array
      const tickets = [];
      // Update ticket data by number of quantities that user decide to reserve
      for (let i = 0; i < quantity; i++) {
        // Create new ticket object as Ticket entity type to solve type conflicts
        const newTicket = queryRunner.manager.create(Ticket, {
          userId: userId,
          concertId: concertId,
          status: "PENDING",
          category: "Basic",
          createAt: new Date(),
        });

        // Push this new Ticket data inside this empty tickets array
        tickets.push(newTicket);
      }

       // Update the Ticket table
        await queryRunner.manager.save(Ticket,tickets);

      // The whole bundle process is success and do transaction commiting
      await queryRunner.commitTransaction();
      res.json({ message: "ticket is reserved." });
    } catch (error) {
      // Roll back error happen in one of the things (ALL or Nothing)
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Leave from lock transaction
      await queryRunner.release();
    }
  }
}
