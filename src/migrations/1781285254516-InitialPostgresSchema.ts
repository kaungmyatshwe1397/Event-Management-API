import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialPostgresSchema1781285254516 implements MigrationInterface {
    name = 'InitialPostgresSchema1781285254516'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "concert" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "stock" integer NOT NULL, "version" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_c96bfb33ee9a95525a3f5269d1f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ticket" ("id" SERIAL NOT NULL, "userId" integer, "concertId" integer NOT NULL, "status" character varying NOT NULL, "createAt" TIMESTAMP NOT NULL, "category" character varying NOT NULL, "internal_note" character varying, "version" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_d9a0835407701eb86f874474b7c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_ticket_concert_id" ON "ticket"  ("concertId") `);
        await queryRunner.query(`CREATE INDEX "idx_ticket_pending_status" ON "ticket"  ("status") WHERE "status"='PENDING'`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying, "role" character varying NOT NULL DEFAULT 'User', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP INDEX "public"."idx_ticket_pending_status"`);
        await queryRunner.query(`DROP INDEX "public"."idx_ticket_concert_id"`);
        await queryRunner.query(`DROP TABLE "ticket"`);
        await queryRunner.query(`DROP TABLE "concert"`);
    }

}
