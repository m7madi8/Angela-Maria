-- CreateEnum
CREATE TYPE "InventoryMode" AS ENUM ('unknown', 'made_to_order', 'tracked');

-- AlterTable
ALTER TABLE "handmade_products" ADD COLUMN "inventory_mode" "InventoryMode" NOT NULL DEFAULT 'unknown';

-- Existing rows keep null price and stock. Zero becomes a real value, not a stand-in for unknown.
ALTER TABLE "handmade_products" DROP CONSTRAINT "handmade_products_price_unknown_or_positive";
ALTER TABLE "handmade_products" ADD CONSTRAINT "handmade_products_price_unknown_or_nonnegative" CHECK ("price_minor_units" IS NULL OR "price_minor_units" >= 0);

ALTER TABLE "handmade_products" DROP CONSTRAINT "handmade_products_stock_unknown_or_positive";
ALTER TABLE "handmade_products" ADD CONSTRAINT "handmade_products_stock_unknown_or_nonnegative" CHECK ("stock_quantity" IS NULL OR "stock_quantity" >= 0);
ALTER TABLE "handmade_products" ADD CONSTRAINT "handmade_products_stock_only_when_tracked" CHECK ("inventory_mode" = 'tracked' OR "stock_quantity" IS NULL);

-- CreateTable
CREATE TABLE "admin_sign_in_challenges" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "consumed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_sign_in_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_sign_in_challenges_token_hash_key" ON "admin_sign_in_challenges"("token_hash");

-- CreateIndex
CREATE INDEX "admin_sign_in_challenges_email_created_at_idx" ON "admin_sign_in_challenges"("email", "created_at");
