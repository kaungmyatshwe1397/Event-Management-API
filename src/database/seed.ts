// Comments for helping myself to remember not for others
// line 3 and 4 is similar to import {pirsma} from prisma;
import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { Concert } from "../entities/concert";
import { User } from "../entities/user";
import bcrypt from "bcrypt";

AppDataSource.initialize().then(async () => {
  const concert = AppDataSource.getRepository(Concert);
  // Check there is seeded concert first
  const seededConcerts =await concert.findOneBy({ name: "Concert A" });
  // If no concert seeded , do seeding , if not pass
  if (!seededConcerts) {
    await concert.save([
      { name: "Concert A", stock: 10 },
      { name: "Concert B", stock: 5 },
      { name: "Concert C", stock: 1 },
    ]);
    console.log("seeded successfully");
  } else {
    console.log("Concerts already exist. Skipping...");
  }

  const user = AppDataSource.getRepository(User);
  // Check admin user already exit or not
  const existingAdmin = await user.findOneBy({ email: "admin@test.com" });

  // If there is no existing admin, create one
  if (!existingAdmin) {
    await user.save({
      username: "AdminUser",
      email: "admin@test.com",
      password: await bcrypt.hash("adminpassword", 10),
      role: "Admin",
    });
    console.log("Admin seeded successfully.");
  }

  // Check tester user for preventing seeding duplication
  const existingUser = await user.findOneBy({ email: "user@test.com" });

  // Create one if there is zero basic user
  if (!existingUser) {
    await user.save({
      username: "NormalUser",
      email: "user@test.com",
      password: await bcrypt.hash("userpassword", 10),
      role: "User",
    });
    console.log("Normal User seeded successfully.");
  }

  console.log("All seeding finished!");

  // In pirsma this pirsma.$disconnect()
  process.exit(0);
});
