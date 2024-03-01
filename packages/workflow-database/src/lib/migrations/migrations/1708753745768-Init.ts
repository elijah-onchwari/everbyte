
import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1708753745768 implements MigrationInterface {

    name = 'Init1708753745768';

    /**
    * Up Migration
    *
    * @param queryRunner
    */
    public async up(queryRunner: QueryRunner): Promise<any> {
        await this.postgresUpQueryRunner(queryRunner);
    }

    /**
    * Down Migration
    *
    * @param queryRunner
    */
    public async down(queryRunner: QueryRunner): Promise<any> {
        await this.postgresDownQueryRunner(queryRunner);
    }

    /**
    * PostgresDB Up Migration
    *
    * @param queryRunner
    */
    public async postgresUpQueryRunner(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "companies" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "active" boolean NOT NULL DEFAULT true, "name" character varying NOT NULL, CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4a2e5d543e6e5c92e8431c7c6e" ON "companies" ("active") `);
        await queryRunner.query(`CREATE INDEX "IDX_3dacbb3eb4f095e29372ff8e13" ON "companies" ("name") `);
        await queryRunner.query(`CREATE TABLE "user_companies" ("is_default" boolean NOT NULL DEFAULT true, "is_active" boolean NOT NULL DEFAULT true, "user_id" uuid NOT NULL, "company_id" uuid NOT NULL, CONSTRAINT "PK_ca73b87c901966a9fb8960916df" PRIMARY KEY ("user_id", "company_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_477e1ed24ee03b5757173551f3" ON "user_companies" ("is_default") `);
        await queryRunner.query(`CREATE INDEX "IDX_3aee02eeb190a88c63b5b3a0be" ON "user_companies" ("is_active") `);
        await queryRunner.query(`CREATE TABLE "roles" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "active" boolean NOT NULL DEFAULT true, "name" character varying NOT NULL, "isSystem" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8879c4534a254c4b0871adc75b" ON "roles" ("active") `);
        await queryRunner.query(`CREATE INDEX "IDX_648e3f5447f725579d7d4ffdfb" ON "roles" ("name") `);
        await queryRunner.query(`CREATE TABLE "role_permissions" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "active" boolean NOT NULL DEFAULT true, "permission" character varying NOT NULL, "enabled" boolean DEFAULT false, "description" character varying, "roleId" uuid NOT NULL, CONSTRAINT "PK_84059017c90bfcb701b8fa42297" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0afcca32810128491615263d89" ON "role_permissions" ("active") `);
        await queryRunner.query(`CREATE INDEX "IDX_0ab5175ebb91e7a07f850acf42" ON "role_permissions" ("permission") `);
        await queryRunner.query(`CREATE INDEX "IDX_b4599f8b8f548d35850afa2d12" ON "role_permissions" ("roleId") `);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "active" boolean NOT NULL DEFAULT true, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "mobile_number" character varying(20) NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0890d8ebe90990c78fe4804231" ON "users" ("active") `);
        await queryRunner.query(`CREATE INDEX "IDX_ef2fb839248017665e5033e730" ON "users" ("first_name") `);
        await queryRunner.query(`CREATE INDEX "IDX_0408cb491623b121499d4fa238" ON "users" ("last_name") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_350c2c34c6fdd4b292ab6e7787" ON "users" ("mobile_number") `);
        await queryRunner.query(`ALTER TABLE "user_companies" ADD CONSTRAINT "FK_50c7d6aeb4ab214ad9fff29ab68" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_companies" ADD CONSTRAINT "FK_9e735e90e4fd3bbb4268ed96d94" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_b4599f8b8f548d35850afa2d12c" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    /**
    * PostgresDB Down Migration
    *
    * @param queryRunner
    */
    public async postgresDownQueryRunner(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_b4599f8b8f548d35850afa2d12c"`);
        await queryRunner.query(`ALTER TABLE "user_companies" DROP CONSTRAINT "FK_9e735e90e4fd3bbb4268ed96d94"`);
        await queryRunner.query(`ALTER TABLE "user_companies" DROP CONSTRAINT "FK_50c7d6aeb4ab214ad9fff29ab68"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_350c2c34c6fdd4b292ab6e7787"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0408cb491623b121499d4fa238"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ef2fb839248017665e5033e730"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0890d8ebe90990c78fe4804231"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b4599f8b8f548d35850afa2d12"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0ab5175ebb91e7a07f850acf42"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0afcca32810128491615263d89"`);
        await queryRunner.query(`DROP TABLE "role_permissions"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_648e3f5447f725579d7d4ffdfb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8879c4534a254c4b0871adc75b"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3aee02eeb190a88c63b5b3a0be"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_477e1ed24ee03b5757173551f3"`);
        await queryRunner.query(`DROP TABLE "user_companies"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3dacbb3eb4f095e29372ff8e13"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4a2e5d543e6e5c92e8431c7c6e"`);
        await queryRunner.query(`DROP TABLE "companies"`);
    }
}
