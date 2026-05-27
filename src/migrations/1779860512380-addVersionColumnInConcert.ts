import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVersionColumnInConcert1779860512380 implements MigrationInterface {
    name = 'AddVersionColumnInConcert1779860512380'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_concert" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "stock" integer NOT NULL, "version" integer NOT NULL DEFAULT (1))`);
        await queryRunner.query(`INSERT INTO "temporary_concert"("id", "name", "stock") SELECT "id", "name", "stock" FROM "concert"`);
        await queryRunner.query(`DROP TABLE "concert"`);
        await queryRunner.query(`ALTER TABLE "temporary_concert" RENAME TO "concert"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "concert" RENAME TO "temporary_concert"`);
        await queryRunner.query(`CREATE TABLE "concert" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "stock" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "concert"("id", "name", "stock") SELECT "id", "name", "stock" FROM "temporary_concert"`);
        await queryRunner.query(`DROP TABLE "temporary_concert"`);
    }

}
