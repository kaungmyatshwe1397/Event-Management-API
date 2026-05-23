import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1779511725459 implements MigrationInterface {
    name = 'Initial1779511725459'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_ticket" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" varchar NOT NULL, "status" varchar NOT NULL, "createAt" datetime NOT NULL, "category" varchar NOT NULL, "concertId" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_ticket"("id", "userId", "status", "createAt", "category") SELECT "id", "userId", "status", "createAt", "category" FROM "ticket"`);
        await queryRunner.query(`DROP TABLE "ticket"`);
        await queryRunner.query(`ALTER TABLE "temporary_ticket" RENAME TO "ticket"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket" RENAME TO "temporary_ticket"`);
        await queryRunner.query(`CREATE TABLE "ticket" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" varchar NOT NULL, "status" varchar NOT NULL, "createAt" datetime NOT NULL, "category" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "ticket"("id", "userId", "status", "createAt", "category") SELECT "id", "userId", "status", "createAt", "category" FROM "temporary_ticket"`);
        await queryRunner.query(`DROP TABLE "temporary_ticket"`);
    }

}
