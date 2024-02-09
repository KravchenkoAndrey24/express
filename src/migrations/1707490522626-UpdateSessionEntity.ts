import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSessionEntity1707490522626 implements MigrationInterface {
  name = 'UpdateSessionEntity1707490522626';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_30e98e8746699fb9af235410aff"`);
    await queryRunner.query(`ALTER TABLE "session" RENAME COLUMN "user_id" TO "user"`);
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_8e05f295cd772ec97ef56642192" FOREIGN KEY ("user") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_8e05f295cd772ec97ef56642192"`);
    await queryRunner.query(`ALTER TABLE "session" RENAME COLUMN "user" TO "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_30e98e8746699fb9af235410aff" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
