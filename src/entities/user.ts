import { Entity,Column,PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    username:string;

    @Column()
    password:string;

    @Column({unique:true , nullable:true})
    email?: string;

    @Column({default:"User"})
    role:"User" | "Admin"
}