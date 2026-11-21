const path = require("path");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool, initDatabase } = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";
const VALID_CATEGORIES = new Set(["感恩恩典", "读书金句", "生活小确幸"]);

app.use(express.json({ limit: "1mb" }));

// 静态资源托管（排除敏感后端文件）
const BLOCKED_FILES = new Set(["/server.js", "/db.js", "/package.json", "/package-lock.json", "/render.yaml"]);
app.use((req, res, next) => {
  if (BLOCKED_FILES.has(req.path)) {
    return res.status(404).send("Not found");
  }
  return next();
});
app.use(express.static(path.join(__dirname)));

/* ==================== 鉴权中间件 ==================== */

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "30d" }
  );
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  return next();
}

/* ==================== 健康检查 & 公开经节接口 ==================== */

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get("/api/verses", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, theme, zh_text, zh_ref, en_text, en_ref FROM verses ORDER BY id ASC"
    );
    const formatted = rows.map((r) => ({
      id: r.id,
      theme: r.theme || "感恩恩典",
      zh: { text: r.zh_text, ref: r.zh_ref },
      en: { text: r.en_text, ref: r.en_ref }
    }));
    const themes = Array.from(new Set(formatted.map((v) => v.theme)));
    res.json({ verses: formatted, themes });
  } catch (err) {
    res.status(500).json({ error: "Failed to load verses" });
  }
});

/* ==================== 用户注册与登录 ==================== */

app.post("/api/auth/signup", async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  const displayName = String(req.body.displayName || "").trim().slice(0, 40);

  if (!email || email.length < 3 || email.length > 120) {
    return res.status(400).json({ error: "Please enter a valid email or username" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  try {
    const { rows: existing } = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: "Account already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const finalName = displayName || email.split("@")[0];
    const { rows } = await pool.query(
      "INSERT INTO users (email, display_name, password_hash, role) VALUES ($1, $2, $3, 'user') RETURNING id, email, display_name, role",
      [email, finalName, passwordHash]
    );

    const user = rows[0];
    const token = signToken(user);
    return res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.display_name,
        role: user.role
      }
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to create account" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const { rows } = await pool.query(
      "SELECT id, email, display_name, password_hash, role FROM users WHERE email = $1",
      [email]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = signToken(user);
    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.display_name,
        role: user.role
      }
    });
  } catch {
    return res.status(500).json({ error: "Login failed" });
  }
});

app.get("/api/auth/me", requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, email, display_name, role FROM users WHERE id = $1",
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const u = rows[0];
    return res.json({
      user: { id: u.id, email: u.email, displayName: u.display_name, role: u.role }
    });
  } catch {
    return res.status(500).json({ error: "Failed to fetch profile" });
  }
});

/* ==================== 个人云端便签 CRUD ==================== */

app.get("/api/notes", requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, category, content, date_label AS date FROM notes WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json({ notes: rows });
  } catch {
    res.status(500).json({ error: "Failed to load notes" });
  }
});

app.post("/api/notes", requireAuth, async (req, res) => {
  const id = String(req.body.id || `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`);
  const category = VALID_CATEGORIES.has(req.body.category) ? req.body.category : "感恩恩典";
  const content = String(req.body.content || "").trim().slice(0, 2000);
  const dateLabel = String(req.body.date || "").trim().slice(0, 32) || new Date().toISOString().slice(0, 10).replace(/-/g, ".");

  if (!content) {
    return res.status(400).json({ error: "Content cannot be empty" });
  }

  try {
    await pool.query(
      `INSERT INTO notes (id, user_id, category, content, date_label)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO NOTHING`,
      [id, req.user.id, category, content, dateLabel]
    );
    return res.status(201).json({ note: { id, category, content, date: dateLabel } });
  } catch {
    return res.status(500).json({ error: "Failed to save note" });
  }
});

app.post("/api/notes/sync", requireAuth, async (req, res) => {
  const incoming = Array.isArray(req.body.notes) ? req.body.notes : [];
  let inserted = 0;

  try {
    for (const item of incoming) {
      if (!item || typeof item.content !== "string") continue;
      const content = item.content.trim().slice(0, 2000);
      if (!content) continue;
      const id = typeof item.id === "string" && item.id ? item.id : `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      // 跳过未修改的默认示例便签，避免重复写入
      if (id.startsWith("sample-")) continue;

      const category = VALID_CATEGORIES.has(item.category) ? item.category : "感恩恩典";
      const dateLabel = typeof item.date === "string" && item.date ? item.date.slice(0, 32) : "2026";
      const result = await pool.query(
        `INSERT INTO notes (id, user_id, category, content, date_label)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO NOTHING`,
        [id, req.user.id, category, content, dateLabel]
      );
      inserted += result.rowCount;
    }

    const { rows } = await pool.query(
      "SELECT id, category, content, date_label AS date FROM notes WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );
    return res.json({ inserted, notes: rows });
  } catch {
    return res.status(500).json({ error: "Failed to sync notes" });
  }
});

app.delete("/api/notes/:id", requireAuth, async (req, res) => {
  try {
    await pool.query("DELETE FROM notes WHERE id = $1 AND user_id = $2", [
      req.params.id,
      req.user.id
    ]);
    return res.json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Failed to delete note" });
  }
});

/* ==================== 管理员后台 API ==================== */

app.get("/api/admin/stats", requireAuth, requireAdmin, async (_req, res) => {
  try {
    const [uRes, nRes, vRes] = await Promise.all([
      pool.query("SELECT COUNT(*)::int AS cnt FROM users"),
      pool.query("SELECT COUNT(*)::int AS cnt FROM notes"),
      pool.query("SELECT COUNT(*)::int AS cnt FROM verses")
    ]);
    res.json({
      usersCount: uRes.rows[0].cnt,
      notesCount: nRes.rows[0].cnt,
      versesCount: vRes.rows[0].cnt
    });
  } catch {
    res.status(500).json({ error: "Failed to load stats" });
  }
});

app.get("/api/admin/users", requireAuth, requireAdmin, async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT u.id, u.email, u.display_name, u.role, u.created_at, COUNT(n.id)::int AS notes_count
      FROM users u
      LEFT JOIN notes n ON n.user_id = u.id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);
    res.json({ users: rows });
  } catch {
    res.status(500).json({ error: "Failed to load users" });
  }
});

app.post("/api/admin/verses", requireAuth, requireAdmin, async (req, res) => {
  const theme = String(req.body.theme || "感恩恩典").trim().slice(0, 40) || "感恩恩典";
  const zhText = String(req.body.zhText || "").trim();
  const zhRef = String(req.body.zhRef || "").trim();
  const enText = String(req.body.enText || "").trim();
  const enRef = String(req.body.enRef || "").trim();

  if (!zhText || !zhRef || !enText || !enRef) {
    return res.status(400).json({ error: "All four verse fields are required" });
  }

  try {
    const { rows } = await pool.query(
      "INSERT INTO verses (theme, zh_text, zh_ref, en_text, en_ref) VALUES ($1, $2, $3, $4, $5) RETURNING id, theme, zh_text, zh_ref, en_text, en_ref",
      [theme, zhText, zhRef, enText, enRef]
    );
    const r = rows[0];
    return res.status(201).json({
      verse: { id: r.id, theme: r.theme, zh: { text: r.zh_text, ref: r.zh_ref }, en: { text: r.en_text, ref: r.en_ref } }
    });
  } catch {
    return res.status(500).json({ error: "Failed to add verse" });
  }
});

app.put("/api/admin/verses/:id", requireAuth, requireAdmin, async (req, res) => {
  const theme = String(req.body.theme || "感恩恩典").trim().slice(0, 40) || "感恩恩典";
  const zhText = String(req.body.zhText || "").trim();
  const zhRef = String(req.body.zhRef || "").trim();
  const enText = String(req.body.enText || "").trim();
  const enRef = String(req.body.enRef || "").trim();

  if (!zhText || !zhRef || !enText || !enRef) {
    return res.status(400).json({ error: "All four verse fields are required" });
  }

  try {
    const { rows } = await pool.query(
      "UPDATE verses SET theme = $1, zh_text = $2, zh_ref = $3, en_text = $4, en_ref = $5 WHERE id = $6 RETURNING id, theme, zh_text, zh_ref, en_text, en_ref",
      [theme, zhText, zhRef, enText, enRef, req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Verse not found" });
    }
    const r = rows[0];
    return res.json({
      verse: { id: r.id, theme: r.theme, zh: { text: r.zh_text, ref: r.zh_ref }, en: { text: r.en_text, ref: r.en_ref } }
    });
  } catch {
    return res.status(500).json({ error: "Failed to update verse" });
  }
});

app.delete("/api/admin/verses/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    await pool.query("DELETE FROM verses WHERE id = $1", [req.params.id]);
    return res.json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Failed to delete verse" });
  }
});

app.post("/api/admin/verses/bulk", requireAuth, requireAdmin, async (req, res) => {
  const defaultTheme = String(req.body.defaultTheme || "感恩恩典").trim().slice(0, 40) || "感恩恩典";
  const rawList = Array.isArray(req.body.verses) ? req.body.verses : null;
  if (!rawList || rawList.length === 0) {
    return res.status(400).json({ error: "No verses provided" });
  }
  if (rawList.length > 500) {
    return res.status(400).json({ error: "Maximum 500 verses per batch" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows: existingRows } = await client.query("SELECT zh_ref, zh_text FROM verses");
    const existingKeys = new Set(existingRows.map((r) => `${r.zh_ref}::${r.zh_text}`));

    let inserted = 0;
    let skipped = 0;

    for (const item of rawList) {
      const theme = String(item.theme || item.category || defaultTheme).trim().slice(0, 40) || defaultTheme;
      const zhText = String(item.zhText || (item.zh && item.zh.text) || "").trim();
      const zhRef = String(item.zhRef || (item.zh && item.zh.ref) || "").trim();
      const enText = String(item.enText || (item.en && item.en.text) || "").trim();
      const enRef = String(item.enRef || (item.en && item.en.ref) || "").trim();

      if (!zhText || !zhRef || !enText || !enRef) {
        skipped += 1;
        continue;
      }

      const dedupKey = `${zhRef}::${zhText}`;
      if (existingKeys.has(dedupKey)) {
        skipped += 1;
        continue;
      }
      existingKeys.add(dedupKey);

      await client.query(
        "INSERT INTO verses (theme, zh_text, zh_ref, en_text, en_ref) VALUES ($1, $2, $3, $4, $5)",
        [theme, zhText, zhRef, enText, enRef]
      );
      inserted += 1;
    }

    await client.query("COMMIT");
    return res.status(201).json({ inserted, skipped, total: rawList.length });
  } catch {
    await client.query("ROLLBACK");
    return res.status(500).json({ error: "Failed to bulk import verses" });
  } finally {
    client.release();
  }
});

/* ==================== 启动服务 ==================== */

initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Soul-Whispers server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database initialization failed:", err);
    process.exit(1);
  });
