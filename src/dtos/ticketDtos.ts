import { Ticket } from "../entities/ticket";

export function ticketDto(ticket:Ticket){
    return {
        id: ticket.id,
        userId: ticket.userId,
        concertId:ticket.concertId,
        status:ticket.status,
        category:ticket.category,
        createAt:ticket.createAt
    }
}