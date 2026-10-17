import { catalogPath } from '../src/catalog/catalog-path';
import { loadShopCatalog } from '../src/catalog/load-shop-catalog';
import { getDb } from '../src/server/db';
import { seedHandmadeCatalog } from '../src/server/seed-catalog';

function publicError(error: unknown): string {
  const message = error instanceof Error ? error.message : 'Seed failed';
  return message.replace(/postgresql:\/\/\S+/gi, 'postgresql://[redacted]');
}

async function main(): Promise<void> {
  const db = getDb();
  try {
    const catalog = loadShopCatalog(catalogPath());
    await seedHandmadeCatalog(db, catalog);
    console.log(`Seeded ${catalog.products.length} handmade products.`);
  } finally {
    await db.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(publicError(error));
  process.exitCode = 1;
});
