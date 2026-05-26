import { Router } from "express";
import { AppDataSource } from "../database/data-source";
import { Ticket } from "../entities/ticket";
import { validationMiddleware } from "../middlewares/validate";
import { purchaseSchema } from "../libs/schema";

const router = Router();
// Purchasing ticket
router.post("/", validationMiddleware(purchaseSchema), async (req, res) => {
  const ticketId = req.body.ticketId;
  // Check ticket is reseverd or not by pending status , and it match id from request body or not
  const purchasedTicket = await AppDataSource.getRepository(Ticket).findOne({
    where: {
      id: ticketId,
      status: "PENDING",
    },
  });
  // Throwing error message if ticket is not valid or update status if purchase is success
  if (!purchasedTicket) {
    return res.status(400).json({ message: "Valid ticket is not found." });
  }
  purchasedTicket.status = "COMPLETED";
  await AppDataSource.getRepository(Ticket).save(purchasedTicket);
  return res
    .status(200)
    .json({ message: "Your ticket purchasing is success." });
});

export default router;
