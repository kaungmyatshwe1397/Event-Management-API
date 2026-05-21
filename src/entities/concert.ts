import { Entity,Column,PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Concert{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    name:string

    @Column()
    stock:number
}