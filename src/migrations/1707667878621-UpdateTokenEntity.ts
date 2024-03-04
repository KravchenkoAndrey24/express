import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTokenEntity1707667878621 implements MigrationInterface {
  name = 'UpdateTokenEntity1707667878621';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_user_token" ("id" SERIAL NOT NULL, "token" text NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_7a29198745281fc7128edaa3713" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "temporary_user_token" ADD CONSTRAINT "FK_2ac95bb07601ae3241eaea5966d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "temporary_user_token" DROP CONSTRAINT "FK_2ac95bb07601ae3241eaea5966d"`);
    await queryRunner.query(`DROP TABLE "temporary_user_token"`);
  }
}
