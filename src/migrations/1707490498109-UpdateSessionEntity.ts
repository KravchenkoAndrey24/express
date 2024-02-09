import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSessionEntity1707490498109 implements MigrationInterface {
  name = 'UpdateSessionEntity1707490498109';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "session" RENAME COLUMN "userId" TO "user_id"`);
    await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "sessionHash"`);
    await queryRunner.query(`ALTER TABLE "session" ADD "sessionHash" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "session" ALTER COLUMN "user_id" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_30e98e8746699fb9af235410aff" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_30e98e8746699fb9af235410aff"`);
    await queryRunner.query(`ALTER TABLE "session" ALTER COLUMN "user_id" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "session" DROP COLUMN "sessionHash"`);
    await queryRunner.query(`ALTER TABLE "session" ADD "sessionHash" character varying(64) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "session" RENAME COLUMN "user_id" TO "userId"`);
  }
}
