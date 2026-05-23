import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1779503806675 implements MigrationInterface {
    name = 'Initial1779503806675'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "concert" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "stock" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "ticket" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" varchar NOT NULL, "status" varchar NOT NULL, "createAt" datetime NOT NULL)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "ticket"`);
        await queryRunner.query(`DROP TABLE "concert"`);
    }

}
