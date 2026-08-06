import cron from "node-cron";
import { AppDataSource } from "../database/data-source";
import { Ticket } from "../entities/ticket";
import { LessThan } from "typeorm";
import { Concert } from "../entities/concert";

// Check for every 10 min
const restockCronTask = cron.schedule("*/10 * * * *", async () => {
  console.log("Checking ticket reservation state ...");

  // Find pending ticket that reserved 15 min ago
  const unpurchasedTickets = await AppDataSource.getRepository(Ticket).find({
    where: {
      status: "PENDING",
      createAt: LessThan(new Date(Date.now() - 15 * 60 * 1000)),
    },
  });

  if (unpurchasedTickets.length == 0) return;

  // Update ticket status and find its related concert one by one
  for (const ticket of unpurchasedTickets) {
    ticket.status = "AVAILABLE";
    ticket.userId = null;
    await AppDataSource.getRepository(Ticket).save(ticket);
    const concert = await AppDataSource.getRepository(Concert).findOneBy({
      id: ticket.concertId,
    });
    // Update ticket available ticket stock for concert
    if (concert) {
      concert.stock += 1;
      await AppDataSource.getRepository(Concert).save(concert);
    }
  }
});

export const stopCrontask = ()=>{
  restockCronTask.stop();
  console.log("Ticket restocking cron task is shut down since server start start gracefully shutting down..")
}