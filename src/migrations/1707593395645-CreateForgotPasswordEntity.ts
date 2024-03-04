import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateForgotPasswordEntity1707593395645 implements MigrationInterface {
  name = 'CreateForgotPasswordEntity1707593395645';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "forgot_password" ("id" SERIAL NOT NULL, "token" character varying(64) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_9b1bedb8b9dd6834196533ee41b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "forgot_password" ADD CONSTRAINT "FK_dba25590105b78ad1a6adfbc6ae" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "forgot_password" DROP CONSTRAINT "FK_dba25590105b78ad1a6adfbc6ae"`);
    await queryRunner.query(`DROP TABLE "forgot_password"`);
  }
}
