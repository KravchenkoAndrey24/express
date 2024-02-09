import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSessionEntity1707486599031 implements MigrationInterface {
  name = 'CreateSessionEntity1707486599031';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "session" ("id" SERIAL NOT NULL, "sessionHash" character varying(64) NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "session"`);
  }
}
