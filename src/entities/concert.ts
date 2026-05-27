import { Entity,Column,PrimaryGeneratedColumn, VersionColumn } from "typeorm";

@Entity()
export class Concert{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    name:string

    @Column()
    stock:number

    @VersionColumn({default:1})
    version:number;
}