import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateForgotPasswordEntity1707594689668 implements MigrationInterface {
    name = 'UpdateForgotPasswordEntity1707594689668'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "forgot_password" DROP COLUMN "token"`);
        await queryRunner.query(`ALTER TABLE "forgot_password" ADD "token" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "forgot_password" DROP COLUMN "token"`);
        await queryRunner.query(`ALTER TABLE "forgot_password" ADD "token" character varying(64) NOT NULL`);
    }

}
