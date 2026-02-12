/**
 * Сид данных для тестов: страницы, 100 категорий (первые 10 — в шапке), 100 коллекций, 1000 товаров с картинками.
 * Суперадмин (supervisor) создаётся миграцией SeedAdminSupervisor, не этим скриптом.
 * Подключение к БД из .env (API_DB_*). Запуск: node scripts/seed-data.js (из папки backend).
 * Картинки скачиваются с picsum.photos в uploads/seed/.
 */
const { Client } = require('pg');
const path = require('path');
const fs = require('fs');

// Загрузка .env из backend/
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const env = fs.readFileSync(envPath, 'utf8');
  env.split('\n').forEach((line) => {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
  });
}

const host = process.env.API_DB_HOST || 'localhost';
const port = parseInt(process.env.API_DB_PORT || '5433', 10);
const user = process.env.API_DB_USERNAME || 'postgres';
const password = process.env.API_DB_PASSWORD || 'postgres';
const database = process.env.API_DB_DATABASE || 'elite_schmuck';

const client = new Client({ host, port, user, password, database });

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function ensureUuidExtension(client) {
  await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
}

async function seedLegalPages(client) {
  for (const [slug, title, content] of [
    ['impressum', 'Impressum', 'TODO: Добавьте юридический текст Impressum'],
    ['datenschutz', 'Datenschutzerklärung', 'TODO: Добавьте текст Datenschutzerklärung'],
  ]) {
    const r = await client.query(
      `SELECT 1 FROM page WHERE slug = $1 LIMIT 1`,
      [slug]
    );
    if (r.rows.length > 0) continue;
    await client.query(
      `INSERT INTO page (slug, title, content, updated_at) VALUES ($1, $2, $3, now())`,
      [slug, title, content]
    );
    console.log(`Добавлена страница ${slug}`);
  }
}

async function seedMetals(client) {
  try {
    const r = await client.query("SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'metal'");
    if (r.rows.length === 0) {
      await client.query(`
        CREATE TABLE metal (id uuid NOT NULL DEFAULT uuid_generate_v4(), name varchar NOT NULL, sort_order int NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY (id))
      `);
    }
    const count = await client.query('SELECT COUNT(*)::int AS c FROM metal');
    if (count.rows[0].c > 0) return;
    await client.query(`
      INSERT INTO metal (id, name, sort_order, created_at) VALUES
        (uuid_generate_v4(), 'Silber', 10, now()),
        (uuid_generate_v4(), 'Gold', 20, now()),
        (uuid_generate_v4(), 'Weißgold', 30, now()),
        (uuid_generate_v4(), 'Gelbgold', 40, now())
    `);
    console.log('Добавлено 4 металла (справочник).');
  } catch (e) {
    console.warn('Металлы (seed):', e.message);
  }
}

const CATEGORY_NAMES = ['Ringe', 'Ohrringe', 'Armbänder', 'Ketten & Anhänger', 'Uhren'];

async function seedCategories(client, count = 100) {
  const existing = await client.query('SELECT COUNT(*)::int AS c FROM category');
  if (existing.rows[0].c >= count) {
    console.log(`Категорий уже ${existing.rows[0].c}, пропуск`);
    return (await client.query('SELECT id FROM category ORDER BY created_at LIMIT $1', [count])).rows.map((r) => r.id);
  }
  const ids = [];
  const HEADER_CATEGORIES_COUNT = 10;
  for (let i = 1; i <= count; i++) {
    const name = i <= CATEGORY_NAMES.length ? CATEGORY_NAMES[i - 1] : `Kategorie ${i}`;
    const slug = slugify(name);
    const showInHeader = i <= HEADER_CATEGORIES_COUNT;
    const r = await client.query(
      `INSERT INTO category (id, name, slug, sort_order, is_visible, show_in_header, created_at, updated_at)
       VALUES (uuid_generate_v4(), $1, $2, $3, true, $4, now(), now())
       RETURNING id`,
      [name, slug, i * 10, showInHeader]
    );
    ids.push(r.rows[0].id);
  }
  console.log(`Добавлено ${count} категорий (первые ${HEADER_CATEGORIES_COUNT} — в шапке)`);
  return ids;
}

const COLLECTION_NAMES = ['Neuheiten', 'Hochzeit', 'Limited Edition'];

async function seedCollections(client, count = 100) {
  const existing = await client.query('SELECT COUNT(*)::int AS c FROM collection');
  if (existing.rows[0].c >= count) {
    console.log(`Коллекций уже ${existing.rows[0].c}, пропуск`);
    return (await client.query('SELECT id FROM collection ORDER BY created_at LIMIT $1', [count])).rows.map((r) => r.id);
  }
  const ids = [];
  for (let i = 1; i <= count; i++) {
    const name = i <= COLLECTION_NAMES.length ? COLLECTION_NAMES[i - 1] : `Kollektion ${i}`;
    const slug = slugify(name);
    const description = i % 5 === 0 ? `Limitierte Kollektion ${i}.` : null;
    const isLimited = i % 5 === 0;
    const r = await client.query(
      `INSERT INTO collection (id, name, slug, description, sort_order, is_limited, created_at, updated_at)
       VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, now(), now())
       RETURNING id`,
      [name, slug, description, i * 10, isLimited]
    );
    ids.push(r.rows[0].id);
  }
  console.log(`Добавлено ${count} коллекций`);
  return ids;
}

const MATERIALS = ['Weißgold 585', 'Gelbgold 585', 'Gelbgold 750', 'Sterlingsilber', 'Edelstahl', 'Platin'];
const STONES = ['Brillant', 'Smaragd', 'Rubin', 'Saphir', null];

/**
 * 8 состояний для pairwise/покрытия тестов: price_type × is_new × is_limited.
 * В каждой категории и в каждой коллекции будут товары во всех этих состояниях.
 */
function stateFromIndex(stateIndex) {
  return {
    priceType: stateIndex % 2 === 0 ? 'fixed' : 'on_request',
    isNew: Math.floor(stateIndex / 2) % 2 === 0,
    isLimited: Math.floor(stateIndex / 4) % 2 === 0,
  };
}

async function seedProducts(client, categoryIds, collectionIds, count = 1000) {
  const existing = await client.query('SELECT COUNT(*)::int AS c FROM product');
  if (existing.rows[0].c >= count) {
    console.log(`Товаров уже ${existing.rows[0].c}, пропуск вставки товаров`);
    return (await client.query('SELECT id FROM product ORDER BY created_at LIMIT $1', [count])).rows.map((r) => r.id);
  }

  const productIds = [];
  const batchSize = 50;
  const numCategories = categoryIds.length;
  const numCollections = collectionIds.length;
  // В каждой категории ровно count/numCategories товаров; в каждом цикле по 8 состояний
  for (let i = 0; i < count; i++) {
    const name = `Produkt ${i + 1}`;
    const slug = `produkt-${i + 1}`;
    const categoryIndex = i % numCategories;
    const categoryId = categoryIds[categoryIndex];
    const positionInCategory = Math.floor(i / numCategories);
    const stateIndex = positionInCategory % 8;
    const { priceType, isNew, isLimited } = stateFromIndex(stateIndex);
    const price = priceType === 'fixed' ? Math.round(50 + (i % 500) * 4) : null;
    const material = MATERIALS[stateIndex % MATERIALS.length];
    const stone = STONES[stateIndex % STONES.length];
    const characteristics = stone ? { Material: material, Stein: stone } : { Material: material };
    // 20% товаров без коллекции; остальные равномерно по коллекциям — в каждой коллекции все состояния
    const collectionId = i % 5 === 0 ? null : collectionIds[i % numCollections];

    const r = await client.query(
      `INSERT INTO product (
        id, name, slug, category_id, collection_id, price_type, price, currency,
        description_short, characteristics, is_new, is_limited, is_active, sort_order, created_at, updated_at
      ) VALUES (
        uuid_generate_v4(), $1, $2, $3, $4, $5, $6, 'EUR',
        $7, $8::jsonb, $9, $10, true, $11, now(), now()
      ) RETURNING id`,
      [
        name,
        slug,
        categoryId,
        collectionId,
        priceType,
        price,
        `Beschreibung für ${name}.`,
        JSON.stringify(characteristics),
        isNew,
        isLimited,
        i + 1,
      ]
    );
    productIds.push(r.rows[0].id);

    if (productIds.length % batchSize === 0) {
      process.stdout.write(`\rТовары: ${productIds.length}/${count}`);
    }
  }
  console.log(`\nДобавлено ${count} товаров (в каждой категории/коллекции — все 8 состояний: fixed/on_request × new/not × limited/not)`);
  return productIds;
}

async function seedProductImages(client, productIds) {
  const existing = await client.query('SELECT COUNT(*)::int AS c FROM product_image');
  if (existing.rows[0].c >= productIds.length) {
    console.log('Картинки товаров уже есть, пропуск');
    return;
  }
  for (let i = 0; i < productIds.length; i++) {
    const productId = productIds[i];
    const filePath = `seed/${productId}.jpg`;
    await client.query(
      `INSERT INTO product_image (id, product_id, file_path, sort_order)
       VALUES (uuid_generate_v4(), $1, $2, 0)`,
      [productId, filePath]
    );
  }
  console.log(`Добавлено ${productIds.length} записей product_image`);
}

// Минимальный валидный JPEG 1×1 (серый пиксель) — fallback, если picsum недоступен
const PLACEHOLDER_JPEG = Buffer.from(
  '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AVN//2Q==',
  'base64'
);

async function downloadImages(productIds, uploadsDir) {
  const seedDir = path.join(uploadsDir, 'seed');
  if (!fs.existsSync(seedDir)) {
    fs.mkdirSync(seedDir, { recursive: true });
  }

  const BATCH = 20;
  for (let i = 0; i < productIds.length; i += BATCH) {
    const chunk = productIds.slice(i, i + BATCH);
    await Promise.all(
      chunk.map(async (productId, idx) => {
        const picId = 1 + ((i + idx) % 1000); // picsum id 1..1000
        const url = `https://picsum.photos/id/${picId}/400/400`;
        const filePath = path.join(seedDir, `${productId}.jpg`);
        if (fs.existsSync(filePath)) return;
        try {
          const res = await fetch(url, { redirect: 'follow' });
          if (!res.ok) throw new Error(res.status);
          const buf = Buffer.from(await res.arrayBuffer());
          if (buf.length < 100) throw new Error('too small');
          fs.writeFileSync(filePath, buf);
        } catch (_) {
          fs.writeFileSync(filePath, PLACEHOLDER_JPEG);
        }
      })
    );
    process.stdout.write(`\rСкачано картинок: ${Math.min(i + BATCH, productIds.length)}/${productIds.length}`);
  }
  console.log('\nКартинки сохранены в uploads/seed/');
}

async function main() {
  const uploadsDir = path.resolve(process.env.API_UPLOADS_DIR || path.join(__dirname, '..', 'uploads'));
  console.log('Подключение к БД...');
  await client.connect();
  try {
    await ensureUuidExtension(client);
    await seedMetals(client);
    await seedLegalPages(client);
    const categoryIds = await seedCategories(client, 100);
    const collectionIds = await seedCollections(client, 100);
    const productIds = await seedProducts(client, categoryIds, collectionIds, 1000);
    await seedProductImages(client, productIds);
    console.log('Скачивание картинок с picsum.photos...');
    await downloadImages(productIds, uploadsDir);
    console.log('Готово.');
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
