(() => {
  const STORAGE_TOKEN_KEY = "soul_whispers_token_v1";
  const STORAGE_THEME_KEY = "gratitude_board_theme_v1";

  let authToken = localStorage.getItem(STORAGE_TOKEN_KEY) || "";
  let toastTimer = null;

  const loginSection = document.getElementById("admin-login-section");
  const dashboardSection = document.getElementById("admin-dashboard");
  const btnLogout = document.getElementById("btn-admin-logout");
  const btnTheme = document.getElementById("btn-admin-theme");

  const loginForm = document.getElementById("admin-login-form");
  const loginError = document.getElementById("admin-login-error");

  const statUsers = document.getElementById("stat-users");
  const statNotes = document.getElementById("stat-notes");
  const statVerses = document.getElementById("stat-verses");

  const verseForm = document.getElementById("verse-form");
  const verseFormTitle = document.getElementById("verse-form-title");
  const editVerseId = document.getElementById("edit-verse-id");
  const zhText = document.getElementById("zh-text");
  const zhRef = document.getElementById("zh-ref");
  const enText = document.getElementById("en-text");
  const enRef = document.getElementById("en-ref");
  const btnCancelEdit = document.getElementById("btn-cancel-edit");

  const versesListEl = document.getElementById("admin-verses-list");
  const usersListEl = document.getElementById("admin-users-list");
  const toastEl = document.getElementById("toast");

  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2400);
  }

  function applyTheme(theme) {
    const isDark = theme === "dark";
    if (isDark) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    btnTheme.textContent = isDark ? "日间模式" : "夜间模式";
  }

  btnTheme.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const next = isDark ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem(STORAGE_THEME_KEY, next);
  });

  async function apiFetch(path, options = {}) {
    const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
    if (authToken) headers.Authorization = `Bearer ${authToken}`;
    const res = await fetch(path, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "请求失败");
    return data;
  }

  function resetVerseForm() {
    editVerseId.value = "";
    verseForm.reset();
    verseFormTitle.textContent = "新增圣经感恩经节";
    btnCancelEdit.classList.add("hidden");
  }

  btnCancelEdit.addEventListener("click", resetVerseForm);

  async function loadDashboard() {
    const [stats, versesData, usersData] = await Promise.all([
      apiFetch("/api/admin/stats"),
      apiFetch("/api/verses"),
      apiFetch("/api/admin/users")
    ]);

    statUsers.textContent = stats.usersCount;
    statNotes.textContent = stats.notesCount;
    statVerses.textContent = stats.versesCount;

    renderVerses(versesData.verses || []);
    renderUsers(usersData.users || []);
  }

  function renderVerses(list) {
    versesListEl.textContent = "";
    list.forEach((v) => {
      const item = document.createElement("div");
      item.className = "admin-item";

      const body = document.createElement("div");
      body.className = "admin-item-body";

      const pZh = document.createElement("p");
      pZh.className = "admin-item-zh";
      pZh.textContent = v.zh.text;

      const pEn = document.createElement("p");
      pEn.className = "admin-item-en";
      pEn.textContent = v.en.text;

      const ref = document.createElement("span");
      ref.className = "admin-item-ref";
      ref.textContent = `${v.zh.ref} · ${v.en.ref}`;

      body.append(pZh, pEn, ref);

      const actions = document.createElement("div");
      actions.className = "admin-item-actions";

      const btnEdit = document.createElement("button");
      btnEdit.type = "button";
      btnEdit.className = "btn-card btn-save-img";
      btnEdit.textContent = "编辑";
      btnEdit.addEventListener("click", () => {
        editVerseId.value = v.id;
        zhText.value = v.zh.text;
        zhRef.value = v.zh.ref;
        enText.value = v.en.text;
        enRef.value = v.en.ref;
        verseFormTitle.textContent = `编辑经节 #${v.id}`;
        btnCancelEdit.classList.remove("hidden");
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

      const btnDel = document.createElement("button");
      btnDel.type = "button";
      btnDel.className = "btn-card btn-delete";
      btnDel.textContent = "删除";
      btnDel.addEventListener("click", async () => {
        try {
          await apiFetch(`/api/admin/verses/${v.id}`, { method: "DELETE" });
          showToast("经节已删除");
          await loadDashboard();
        } catch (err) {
          showToast(err.message);
        }
      });

      actions.append(btnEdit, btnDel);
      item.append(body, actions);
      versesListEl.appendChild(item);
    });
  }

  function renderUsers(users) {
    usersListEl.textContent = "";
    users.forEach((u) => {
      const item = document.createElement("div");
      item.className = "admin-item";

      const body = document.createElement("div");
      body.className = "admin-item-body";

      const pTitle = document.createElement("p");
      pTitle.className = "admin-item-zh";
      pTitle.textContent = `${u.display_name || u.email} (${u.email})`;

      const pMeta = document.createElement("p");
      pMeta.className = "admin-item-en";
      pMeta.textContent = `角色: ${u.role} · 便签数: ${u.notes_count} · 注册时间: ${String(u.created_at).slice(0, 10)}`;

      body.append(pTitle, pMeta);
      item.appendChild(body);
      usersListEl.appendChild(item);
    });
  }

  verseForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      zhText: zhText.value.trim(),
      zhRef: zhRef.value.trim(),
      enText: enText.value.trim(),
      enRef: enRef.value.trim()
    };

    try {
      if (editVerseId.value) {
        await apiFetch(`/api/admin/verses/${editVerseId.value}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
        showToast("经节已更新");
      } else {
        await apiFetch("/api/admin/verses", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        showToast("已新增经节");
      }
      resetVerseForm();
      await loadDashboard();
    } catch (err) {
      showToast(err.message);
    }
  });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginError.classList.add("hidden");
    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: document.getElementById("admin-email").value.trim(),
          password: document.getElementById("admin-password").value
        })
      });
      if (!data.user || data.user.role !== "admin") {
        throw new Error("该账号不是管理员账号");
      }
      authToken = data.token;
      localStorage.setItem(STORAGE_TOKEN_KEY, authToken);
      loginSection.classList.add("hidden");
      dashboardSection.classList.remove("hidden");
      btnLogout.classList.remove("hidden");
      await loadDashboard();
    } catch (err) {
      loginError.textContent = err.message;
      loginError.classList.remove("hidden");
    }
  });

  btnLogout.addEventListener("click", () => {
    authToken = "";
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    dashboardSection.classList.add("hidden");
    btnLogout.classList.add("hidden");
    loginSection.classList.remove("hidden");
  });

  async function init() {
    applyTheme(localStorage.getItem(STORAGE_THEME_KEY) || "light");
    if (!authToken) return;
    try {
      const me = await apiFetch("/api/auth/me");
      if (me.user && me.user.role === "admin") {
        loginSection.classList.add("hidden");
        dashboardSection.classList.remove("hidden");
        btnLogout.classList.remove("hidden");
        await loadDashboard();
      }
    } catch {
      authToken = "";
    }
  }

  init();
})();
