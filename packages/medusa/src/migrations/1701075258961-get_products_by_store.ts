import { MigrationInterface, QueryRunner } from "typeorm"

export class GetProductsByStore1701075258961 implements MigrationInterface {
  name = "AddStoreRelationToProduct1637975000001"

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Step 1: Add store_id column to the product table
    await queryRunner.query(`
      ALTER TABLE "product"
      ADD COLUMN "store_id" character varying NOT NULL;

      CREATE INDEX "IDX_store_id" ON "product" ("store_id");
    `)

    // Step 2: Add foreign key constraint to the product table
    await queryRunner.query(`
      ALTER TABLE "product"
      ADD CONSTRAINT "FK_f552bbf2bdc983b83e0b396b429"
      FOREIGN KEY ("store_id") REFERENCES "store"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION;
    `)

    await queryRunner.query(
      `ALTER TABLE "store" ADD "product_id" character varying`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Step 1: Drop foreign key constraint from the product table
    await queryRunner.query(`
   ALTER TABLE "product"
   DROP CONSTRAINT "FK_f552bbf2bdc983b83e0b396b429";
 `)

    // Step 2: Drop index and column from the product table
    await queryRunner.query(`
   DROP INDEX "IDX_store_id";
   ALTER TABLE "product"
   DROP COLUMN "store_id";
 `)

    // Step 3: Drop column from the store table
    await queryRunner.query(`
   ALTER TABLE "store"
   DROP COLUMN "product_id";
 `)
  }
}
