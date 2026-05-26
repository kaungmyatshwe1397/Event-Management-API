import { DataSource } from "typeorm";
import { Concert } from "../entities/concert";
import { Ticket } from "../entities/ticket";
import { User } from "../entities/user";


export const AppDataSource = new DataSource({
    type: 'better-sqlite3',
  database: 'database.sqlite',
  entities: [Concert,Ticket,User],
  migrations: [__dirname + "/../migrations/**/*{.js,.ts}"],
  synchronize: false,
})