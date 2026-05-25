import * as z from "zod";

// Create schema object for reserve input data validation
export const reserveSchema = z.object({
    userId : z.number(),
    concertId : z.number(),
    quantity:z.int().min(1).max(5)
});

// Create a schema object for ticket purchasing input data validatoin
export const purchaseSchema = z.object({
    ticketId:z.number(),
})