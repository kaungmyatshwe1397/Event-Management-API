import { Entity, Column, PrimaryGeneratedColumn, Index } from "typeorm";

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Index("idx_ticket_concert_id")
  @Column()
  concertId: number;

  // Partial indexing for searching database row where status is "PENDING"
  @Index("idx_ticket_pending_status",{where:`"status"='PENDING'`})
  @Column()
  status: "AVAILABLE" | "PENDING" | "COMPLETED";

  @Column()
  createAt: Date;

  @Column()
  category: "VIP" | "Basic";
}
