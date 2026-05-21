import { DataSource } from "typeorm";
import { Concert } from "../entities/concert";
import { Ticket } from "../entities/ticket";

export const AppDataSource = new DataSource({
    type: 'better-sqlite3',
  database: 'database.sqlite',
  entities: [Concert,Ticket],
  migrations: [],
  synchronize: false,
})