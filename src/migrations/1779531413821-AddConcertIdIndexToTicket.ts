import { MigrationInterface, QueryRunner } from "typeorm";

export class AddConcertIdIndexToTicket1779531413821 implements MigrationInterface {
    name = 'AddConcertIdIndexToTicket1779531413821'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_ef8e1c3effd13564a3e3dd569a"`);
        await queryRunner.query(`CREATE INDEX "idx_ticket_concert_id" ON "ticket" ("concertId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "idx_ticket_concert_id"`);
        await queryRunner.query(`CREATE INDEX "IDX_ef8e1c3effd13564a3e3dd569a" ON "ticket" ("concertId") `);
    }

}
