import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1642500000000 implements MigrationInterface {
  name = 'InitialSchema1642500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create weight_class table
    await queryRunner.query(`
      CREATE TABLE "weight_class" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "minWeight" integer,
        "maxWeight" integer,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_weight_class_name" UNIQUE ("name"),
        CONSTRAINT "PK_weight_class_id" PRIMARY KEY ("id")
      )
    `);

    // Create fighter table
    await queryRunner.query(`
      CREATE TABLE "fighter" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "firstName" character varying NOT NULL,
        "lastName" character varying NOT NULL,
        "nickname" character varying,
        "dateOfBirth" date NOT NULL,
        "nationality" character varying NOT NULL,
        "height" integer NOT NULL,
        "weight" integer NOT NULL,
        "reach" integer,
        "stance" character varying,
        "record" jsonb,
        "weightClassId" uuid,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_fighter_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_fighter_weightClass" FOREIGN KEY ("weightClassId") REFERENCES "weight_class"("id") ON DELETE SET NULL
      )
    `);

    // Create event table
    await queryRunner.query(`
      CREATE TABLE "event" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "date" TIMESTAMP NOT NULL,
        "location" character varying NOT NULL,
        "description" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_event_id" PRIMARY KEY ("id")
      )
    `);

    // Create fight table
    await queryRunner.query(`
      CREATE TABLE "fight" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "fighter1Id" uuid NOT NULL,
        "fighter2Id" uuid NOT NULL,
        "eventId" uuid NOT NULL,
        "result" character varying,
        "method" character varying,
        "round" integer,
        "time" character varying,
        "weightClassId" uuid,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_fight_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_fight_fighter1" FOREIGN KEY ("fighter1Id") REFERENCES "fighter"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_fight_fighter2" FOREIGN KEY ("fighter2Id") REFERENCES "fighter"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_fight_event" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_fight_weightClass" FOREIGN KEY ("weightClassId") REFERENCES "weight_class"("id") ON DELETE SET NULL
      )
    `);

    // Create ranking table
    await queryRunner.query(`
      CREATE TABLE "ranking" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "fighterId" uuid NOT NULL,
        "weightClassId" uuid NOT NULL,
        "position" integer NOT NULL,
        "points" integer NOT NULL DEFAULT 0,
        "wins" integer NOT NULL DEFAULT 0,
        "losses" integer NOT NULL DEFAULT 0,
        "draws" integer NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_ranking_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_ranking_fighter_weightClass" UNIQUE ("fighterId", "weightClassId"),
        CONSTRAINT "FK_ranking_fighter" FOREIGN KEY ("fighterId") REFERENCES "fighter"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_ranking_weightClass" FOREIGN KEY ("weightClassId") REFERENCES "weight_class"("id") ON DELETE CASCADE
      )
    `);

    // Create indexes for better performance
    await queryRunner.query(`CREATE INDEX "IDX_fighter_weightClass" ON "fighter" ("weightClassId")`);
    await queryRunner.query(`CREATE INDEX "IDX_fight_fighter1" ON "fight" ("fighter1Id")`);
    await queryRunner.query(`CREATE INDEX "IDX_fight_fighter2" ON "fight" ("fighter2Id")`);
    await queryRunner.query(`CREATE INDEX "IDX_fight_event" ON "fight" ("eventId")`);
    await queryRunner.query(`CREATE INDEX "IDX_ranking_weightClass" ON "ranking" ("weightClassId")`);
    await queryRunner.query(`CREATE INDEX "IDX_ranking_position" ON "ranking" ("position")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_ranking_position"`);
    await queryRunner.query(`DROP INDEX "IDX_ranking_weightClass"`);
    await queryRunner.query(`DROP INDEX "IDX_fight_event"`);
    await queryRunner.query(`DROP INDEX "IDX_fight_fighter2"`);
    await queryRunner.query(`DROP INDEX "IDX_fight_fighter1"`);
    await queryRunner.query(`DROP INDEX "IDX_fighter_weightClass"`);

    // Drop tables in reverse order
    await queryRunner.query(`DROP TABLE "ranking"`);
    await queryRunner.query(`DROP TABLE "fight"`);
    await queryRunner.query(`DROP TABLE "event"`);
    await queryRunner.query(`DROP TABLE "fighter"`);
    await queryRunner.query(`DROP TABLE "weight_class"`);
  }
}
