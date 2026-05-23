// Comments for helping myself to remember not for others
// line 3 and 4 is similar to import {pirsma} from prisma;
import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { Concert } from "../entities/concert";

AppDataSource.initialize().then(async()=>{
    // In prisma we wirte prisma.concert.create()
    // In typeORM we wirte AppDataSource.getRepository(Concert).save
    const concert = AppDataSource.getRepository(Concert)

    await concert.save([
         { name: 'Concert A', stock: 10 },
    { name: 'Concert B', stock: 5 },
    { name: 'Concert C', stock: 1 },
    ])
    console.log("seeded successfully")
    // In pirsma this pirsma.$disconnect()
    process.exit(0);
})