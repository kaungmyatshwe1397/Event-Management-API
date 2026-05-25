import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewColumnsToTicket1779717462667 implements MigrationInterface {
    name = 'AddNewColumnsToTicket1779717462667'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "idx_ticket_pending_status"`);
        await queryRunner.query(`DROP INDEX "idx_ticket_concert_id"`);
        await queryRunner.query(`CREATE TABLE "temporary_ticket" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" integer NOT NULL, "status" varchar NOT NULL, "createAt" datetime NOT NULL, "category" varchar NOT NULL, "concertId" integer NOT NULL, "internal_note" varchar, "version" integer NOT NULL DEFAULT (1))`);
        await queryRunner.query(`INSERT INTO "temporary_ticket"("id", "userId", "status", "createAt", "category", "concertId") SELECT "id", "userId", "status", "createAt", "category", "concertId" FROM "ticket"`);
        await queryRunner.query(`DROP TABLE "ticket"`);
        await queryRunner.query(`ALTER TABLE "temporary_ticket" RENAME TO "ticket"`);
        await queryRunner.query(`CREATE INDEX "idx_ticket_pending_status" ON "ticket" ("status") WHERE "status"='PENDING'`);
        await queryRunner.query(`CREATE INDEX "idx_ticket_concert_id" ON "ticket" ("concertId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "idx_ticket_concert_id"`);
        await queryRunner.query(`DROP INDEX "idx_ticket_pending_status"`);
        await queryRunner.query(`ALTER TABLE "ticket" RENAME TO "temporary_ticket"`);
        await queryRunner.query(`CREATE TABLE "ticket" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" integer NOT NULL, "status" varchar NOT NULL, "createAt" datetime NOT NULL, "category" varchar NOT NULL, "concertId" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "ticket"("id", "userId", "status", "createAt", "category", "concertId") SELECT "id", "userId", "status", "createAt", "category", "concertId" FROM "temporary_ticket"`);
        await queryRunner.query(`DROP TABLE "temporary_ticket"`);
        await queryRunner.query(`CREATE INDEX "idx_ticket_concert_id" ON "ticket" ("concertId") `);
        await queryRunner.query(`CREATE INDEX "idx_ticket_pending_status" ON "ticket" ("status") WHERE "status"='PENDING'`);
    }

}
