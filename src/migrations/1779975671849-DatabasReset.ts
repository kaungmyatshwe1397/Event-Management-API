import { MigrationInterface, QueryRunner } from "typeorm";

export class DatabasReset1779975671849 implements MigrationInterface {
    name = 'DatabasReset1779975671849'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "concert" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "stock" integer NOT NULL, "version" integer NOT NULL DEFAULT (1))`);
        await queryRunner.query(`CREATE TABLE "ticket" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" integer, "concertId" integer NOT NULL, "status" varchar NOT NULL, "createAt" datetime NOT NULL, "category" varchar NOT NULL, "internal_note" varchar, "version" integer NOT NULL DEFAULT (1))`);
        await queryRunner.query(`CREATE INDEX "idx_ticket_concert_id" ON "ticket" ("concertId") `);
        await queryRunner.query(`CREATE INDEX "idx_ticket_pending_status" ON "ticket" ("status") WHERE "status"='PENDING'`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "password" varchar NOT NULL, "email" varchar, "role" varchar NOT NULL DEFAULT ('User'), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP INDEX "idx_ticket_pending_status"`);
        await queryRunner.query(`DROP INDEX "idx_ticket_concert_id"`);
        await queryRunner.query(`DROP TABLE "ticket"`);
        await queryRunner.query(`DROP TABLE "concert"`);
    }

}
