import { Entity,Column,PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Ticket{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    userId:string

    @Column()
    status:'PENDING' | 'COMPLETED'

    @Column()
    createAt:Date

    @Column()
    category: 'VIP' | 'Basic' 
}