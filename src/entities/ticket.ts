import { Entity,Column,PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Ticket{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    userId:number

    @Column()
    concertId:number

    @Column()
    status:'AVAILABLE'|'PENDING' | 'COMPLETED'

    @Column()
    createAt:Date

    @Column()
    category: 'VIP' | 'Basic' 
}