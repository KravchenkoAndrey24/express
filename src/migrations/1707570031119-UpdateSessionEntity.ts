import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSessionEntity1707570031119 implements MigrationInterface {
  name = 'UpdateSessionEntity1707570031119';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_8e05f295cd772ec97ef56642192"`);
    await queryRunner.query(`ALTER TABLE "session" RENAME COLUMN "user" TO "userId"`);
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`);
    await queryRunner.query(`ALTER TABLE "session" RENAME COLUMN "userId" TO "user"`);
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_8e05f295cd772ec97ef56642192" FOREIGN KEY ("user") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
