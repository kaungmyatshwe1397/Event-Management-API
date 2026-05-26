import { Router } from "express";
import { AppDataSource } from "../database/data-source";
import { Ticket } from "../entities/ticket";
import { ticketDto } from "../dtos/ticketDtos";
import { statusSchema } from "../libs/schema";

const router = Router();

// Get all tickets which are purchase by user
router.get("/:id/tickets", async (req, res) => {
  // Get user id and ticket status and use it to find tickets
  const id = Number(req.params.id);
  const status = statusSchema.parse(req.query.status) ?? "COMPLETED";
  const userTickets = await AppDataSource.getRepository(Ticket).find({
    where: {
      userId: id,
      status: status,
    },
  });
  if (userTickets.length == 0) {
    return res.status(404).json("User don't have any ticket.");
  }
  // Filter Raw ticket data come from database by DTOs function and respones clean data
  const filterTicketData = userTickets.map((e) => ticketDto(e));
  return res.status(200).json(filterTicketData);
});

export default router;
