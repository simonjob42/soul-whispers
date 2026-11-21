const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const DEFAULT_VERSES = require("./verses.js");

const dbUrl = process.env.DATABASE_URL || "";
const useSsl = dbUrl.includes(".render.com") || dbUrl.includes("sslmode=require");

const pool = new Pool({
  connectionString: dbUrl || undefined,
  ssl: useSsl ? { rejectUnauthorized: false } : false
});

async function initDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      display_name TEXT NOT NULL DEFAULT '',
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      category TEXT NOT NULL,
      content TEXT NOT NULL,
      date_label TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_notes_user_created
    ON notes (user_id, created_at DESC);
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS verses (
      id SERIAL PRIMARY KEY,
      zh_text TEXT NOT NULL,
      zh_ref TEXT NOT NULL,
      en_text TEXT NOT NULL,
      en_ref TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  // 首次启动时自动导入内置 30 条和合本 & KJV 经节
  const { rows: verseCountRows } = await pool.query("SELECT COUNT(*)::int AS cnt FROM verses");
  if (verseCountRows[0].cnt === 0 && Array.isArray(DEFAULT_VERSES)) {
    for (const item of DEFAULT_VERSES) {
      await pool.query(
        "INSERT INTO verses (zh_text, zh_ref, en_text, en_ref) VALUES ($1, $2, $3, $4)",
        [item.zh.text, item.zh.ref, item.en.text, item.en.ref]
      );
    }
    console.log(`Seeded ${DEFAULT_VERSES.length} default verses into PostgreSQL.`);
  }

  // 若配置了 ADMIN_EMAIL 与 ADMIN_PASSWORD，自动确保管理员账号存在
  const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "";
  if (adminEmail && adminPassword) {
    const { rows: existing } = await pool.query("SELECT id, role FROM users WHERE email = $1", [adminEmail]);
    if (existing.length === 0) {
      const hash = await bcrypt.hash(adminPassword, 10);
      await pool.query(
        "INSERT INTO users (email, display_name, password_hash, role) VALUES ($1, $2, $3, 'admin')",
        [adminEmail, "Admin", hash]
      );
      console.log(`Created admin account: ${adminEmail}`);
    } else if (existing[0].role !== "admin") {
      await pool.query("UPDATE users SET role = 'admin' WHERE id = $1", [existing[0].id]);
    }
  }
}

module.exports = { pool, initDatabase };
