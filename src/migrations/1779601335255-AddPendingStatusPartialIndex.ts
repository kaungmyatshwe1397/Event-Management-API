import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPendingStatusPartialIndex1779601335255 implements MigrationInterface {
    name = 'AddPendingStatusPartialIndex1779601335255'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "idx_ticket_pending_status" ON "ticket" ("status") WHERE "status"='PENDING'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "idx_ticket_pending_status"`);
    }

}
