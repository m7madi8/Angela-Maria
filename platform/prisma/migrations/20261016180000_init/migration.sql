-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "OfferingType" AS ENUM ('handmade_product', 'workshop', 'live_class', 'recorded_course');

-- CreateEnum
CREATE TYPE "OfferingStatus" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "Locale" AS ENUM ('en', 'ar');

-- CreateTable
CREATE TABLE "offerings" (
    "id" TEXT NOT NULL,
    "type" "OfferingType" NOT NULL,
    "status" "OfferingStatus" NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "offerings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offering_translations" (
    "id" TEXT NOT NULL,
    "offering_id" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "offering_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "handmade_products" (
    "slug" TEXT NOT NULL,
    "offering_id" TEXT NOT NULL,
    "category_key" TEXT NOT NULL,
    "category_label" TEXT NOT NULL,
    "price_minor_units" INTEGER,
    "currency" CHAR(3) NOT NULL DEFAULT 'ILS',
    "stock_quantity" INTEGER,
    "source_available" BOOLEAN NOT NULL,
    "featured" BOOLEAN NOT NULL,
    "layout" TEXT NOT NULL,
    "image_focus" TEXT,
    "images" JSONB NOT NULL,

    CONSTRAINT "handmade_products_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "product_translations" (
    "id" TEXT NOT NULL,
    "product_slug" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "points" JSONB NOT NULL,
    "materials" TEXT,
    "dimensions" TEXT,
    "care" TEXT,

    CONSTRAINT "product_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "offerings_type_status_idx" ON "offerings"("type", "status");

-- CreateIndex
CREATE UNIQUE INDEX "offering_translations_offering_id_locale_key" ON "offering_translations"("offering_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "handmade_products_offering_id_key" ON "handmade_products"("offering_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_translations_product_slug_locale_key" ON "product_translations"("product_slug", "locale");

-- AddForeignKey
ALTER TABLE "offering_translations" ADD CONSTRAINT "offering_translations_offering_id_fkey" FOREIGN KEY ("offering_id") REFERENCES "offerings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "handmade_products" ADD CONSTRAINT "handmade_products_offering_id_fkey" FOREIGN KEY ("offering_id") REFERENCES "offerings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_translations" ADD CONSTRAINT "product_translations_product_slug_fkey" FOREIGN KEY ("product_slug") REFERENCES "handmade_products"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- Missing money and stock stay null. Zero is not a stand-in for unknown.
ALTER TABLE "handmade_products" ADD CONSTRAINT "handmade_products_price_unknown_or_positive" CHECK ("price_minor_units" IS NULL OR "price_minor_units" > 0);
ALTER TABLE "handmade_products" ADD CONSTRAINT "handmade_products_stock_unknown_or_positive" CHECK ("stock_quantity" IS NULL OR "stock_quantity" > 0);
