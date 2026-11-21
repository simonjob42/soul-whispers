(() => {
  const STORAGE_NOTES_KEY = "gratitude_board_notes_v1";
  const STORAGE_INIT_KEY = "gratitude_board_initialized_v1";
  const STORAGE_THEME_KEY = "gratitude_board_theme_v1";
  const STORAGE_LANG_KEY = "gratitude_board_lang_v1";

  const I18N = {
    zh: {
      htmlLang: "zh-CN",
      pageTitle: "心语 · Soul-Whispers",
      siteTitle: "心语",
      subtitleSuffix: "在日常微光中记录恩典、思索与小确幸",
      installApp: "安装 App",
      langToggle: "EN",
      themeDark: "夜间模式",
      themeLight: "日间模式",
      verseTag: "今日和合本感恩经节",
      nextVerse: "换一节",
      collectVerse: "收入便签",
      verseRefPrefix: "《和合本》",
      composerLabel: "选择便签分类",
      placeholder: "写下今天值得感恩的一件事、打动你的书摘，或一个温暖的瞬间……",
      hintPrefix: "提示：按",
      hintSuffix: "快速贴上便签",
      addNoteBtn: "贴上便签",
      boardTitle: "灵感便签墙",
      filterAll: "全部",
      categories: {
        "感恩恩典": "感恩恩典",
        "读书金句": "读书金句",
        "生活小确幸": "生活小确幸"
      },
      sampleDate: "示例便签",
      savePngBtn: "保存为卡片图片",
      deleteBtn: "删除",
      countAll: (n) => `${n} 张便签`,
      countFiltered: (v, t) => `${v} / ${t} 张便签`,
      emptyTitle: "便签墙暂时空着",
      emptyDesc: "在上方写下第一句感恩或灵感，贴上属于今天的记忆吧。",
      emptyFilterTitle: (cat) => `「${cat}」分类下暂无便签`,
      emptyFilterDesc: "试着切换到其他分类，或写下一条新的记录吧。",
      footer: "所有便签仅保存在当前浏览器本地 · 愿你今日平安喜乐",
      exportBrand: "心语 · 每日感恩与灵感",
      exportFilePrefix: "心语便签",
      toasts: {
        collected: "已将今日经节收入便签墙",
        emptyInput: "请先写点内容再贴上便签哦",
        added: "已贴上便签",
        removed: "便签已移除",
        noCanvas: "图片导出组件未能加载，请检查网络连接",
        generating: "正在生成精美卡片图片…",
        savedImg: "卡片图片已保存到本地",
        imgError: "图片生成失败，请稍后重试",
        darkOn: "已开启夜间护眼模式",
        darkOff: "已切换回日间羊皮纸模式",
        langSwitched: "已切换为中文界面"
      }
    },
    en: {
      htmlLang: "en",
      pageTitle: "Soul-Whispers · 心语",
      siteTitle: "Soul-Whispers",
      subtitleSuffix: "Capture grace, reflections, and quiet joys in everyday light",
      installApp: "Install App",
      langToggle: "中文",
      themeDark: "Dark Mode",
      themeLight: "Light Mode",
      verseTag: "Daily Gratitude Verse",
      nextVerse: "Another",
      collectVerse: "Save as Note",
      verseRefPrefix: "KJV",
      composerLabel: "Category",
      placeholder: "Write down something you're grateful for, a book quote, or a quiet joy from today...",
      hintPrefix: "Tip: Press",
      hintSuffix: "to post quickly",
      addNoteBtn: "Post Note",
      boardTitle: "Inspiration Wall",
      filterAll: "All",
      categories: {
        "感恩恩典": "Grace & Gratitude",
        "读书金句": "Book Quotes",
        "生活小确幸": "Little Joys"
      },
      sampleDate: "Sample",
      savePngBtn: "Save PNG",
      deleteBtn: "Delete",
      countAll: (n) => `${n} ${n === 1 ? "note" : "notes"}`,
      countFiltered: (v, t) => `${v} / ${t} notes`,
      emptyTitle: "Your board is empty",
      emptyDesc: "Write your first note of gratitude or inspiration above to pin it here.",
      emptyFilterTitle: (cat) => `No notes in "${cat}" yet`,
      emptyFilterDesc: "Try switching to another category or posting a new note above.",
      footer: "All notes are saved locally in your browser · Wishing you peace and joy today",
      exportBrand: "Soul-Whispers · Daily Gratitude",
      exportFilePrefix: "soul-whispers-note",
      toasts: {
        collected: "Daily verse pinned to your board",
        emptyInput: "Please write something before posting",
        added: "Note pinned to board",
        removed: "Note removed",
        noCanvas: "Image export library failed to load; check your connection",
        generating: "Generating your card image...",
        savedImg: "Card image saved",
        imgError: "Failed to generate image; please try again",
        darkOn: "Eye-care Dark Mode enabled",
        darkOff: "Switched back to Parchment Light Mode",
        langSwitched: "Switched to English"
      }
    }
  };

  const SAMPLE_TRANSLATIONS = {
    "sample-1": {
      zh: "清晨醒来听见窗外的鸟鸣，空气里有微凉的阳光。许多我们习以为常的日常，其实都是被悄悄托住的恩典。心怀感恩，平凡的一天也会发光。",
      en: "Waking up to birdsong outside the window and cool morning sunlight. So many ordinary moments we take for granted are quiet gifts of grace. With a grateful heart, even a simple day shines."
    },
    "sample-2": {
      zh: "“一个人知道自己为什么而活，就可以忍受任何一种生活。”\n—— 维克多·弗兰克尔《活出生命的意义》\n\n在忙碌与喧嚣里，保持内心的锚点，比盲目赶路更重要。",
      en: "\"He who has a why to live can bear almost any how.\"\n— Viktor E. Frankl, Man's Search for Meaning\n\nAmid busyness and noise, keeping an inner anchor matters far more than rushing ahead."
    },
    "sample-3": {
      zh: "傍晚散步时恰好遇见一片粉紫色的晚霞，顺路买到刚出炉的热面包。原来治愈自己的，往往就是这些不用花大力气的小瞬间。",
      en: "Caught a soft lavender sunset on an evening walk and picked up warm bread fresh from the oven. Often, the gentlest healing comes from small moments that ask for nothing."
    }
  };

  const DEFAULT_NOTES = [
    { id: "sample-1", category: "感恩恩典", content: SAMPLE_TRANSLATIONS["sample-1"].zh, date: "示例便签" },
    { id: "sample-2", category: "读书金句", content: SAMPLE_TRANSLATIONS["sample-2"].zh, date: "示例便签" },
    { id: "sample-3", category: "生活小确幸", content: SAMPLE_TRANSLATIONS["sample-3"].zh, date: "示例便签" }
  ];

  // DOM 元素
  const btnLangToggle = document.getElementById("btn-lang-toggle");
  const langToggleLabel = document.getElementById("lang-toggle-label");
  const btnThemeToggle = document.getElementById("btn-theme-toggle");
  const themeToggleLabel = document.getElementById("theme-toggle-label");

  const siteTitleEl = document.querySelector(".site-title");
  const siteSubtitleEl = document.querySelector(".site-subtitle");
  const verseTagEl = document.querySelector(".verse-tag");
  const verseTextEl = document.getElementById("verse-text");
  const verseRefEl = document.getElementById("verse-ref");
  const btnNextVerse = document.getElementById("btn-next-verse");
  const btnCollectVerse = document.getElementById("btn-collect-verse");

  const composerLabelEl = document.querySelector(".composer-label");
  const categoryPills = document.querySelectorAll(".category-pills .pill");
  const noteInput = document.getElementById("note-input");
  const composerHintEl = document.querySelector(".composer-hint");
  const btnAddNote = document.getElementById("btn-add-note");

  const boardTitleEl = document.querySelector(".board-title");
  const filterTabs = document.querySelectorAll(".filter-bar .filter-tab");
  const notesGrid = document.getElementById("notes-grid");
  const notesCountEl = document.getElementById("notes-count");
  const emptyStateEl = document.getElementById("empty-state");
  const emptyTitleEl = document.getElementById("empty-title");
  const emptyDescEl = document.getElementById("empty-desc");
  const footerTextEl = document.querySelector(".site-footer p");
  const toastEl = document.getElementById("toast");
  const exportStage = document.getElementById("export-stage");

  let currentLang = "zh";
  let selectedCategory = "感恩恩典";
  let activeFilter = "全部";
  let currentVerseIndex = 0;
  let notes = [];
  let toastTimer = null;

  /* ==================== 工具函数 ==================== */

  function t() {
    return I18N[currentLang] || I18N.zh;
  }

  function getTodayKey() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function formatDisplayDate(dateObj = new Date()) {
    if (currentLang === "en") {
      return dateObj.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    }
    const y = dateObj.getFullYear();
    const m = dateObj.getMonth() + 1;
    const d = dateObj.getDate();
    const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    return `${y} 年 ${m} 月 ${d} 日 ${weekdays[dateObj.getDay()]}`;
  }

  function formatShortDate(dateObj = new Date()) {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, "0");
    const d = String(dateObj.getDate()).padStart(2, "0");
    return `${y}.${m}.${d}`;
  }

  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i += 1) {
      hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
    }
    return hash;
  }

  function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("show");
    if (toastTimer) {
      clearTimeout(toastTimer);
    }
    toastTimer = setTimeout(() => {
      toastEl.classList.remove("show");
    }, 2400);
  }

  function setButtonLabel(btn, text) {
    const icon = btn.querySelector("svg");
    btn.textContent = "";
    if (icon) btn.appendChild(icon);
    btn.appendChild(document.createTextNode(text));
  }

  /* ==================== 每日圣经经节 ==================== */

  function initDailyVerse() {
    if (!Array.isArray(GRATITUDE_VERSES) || GRATITUDE_VERSES.length === 0) return;
    currentVerseIndex = hashString(getTodayKey()) % GRATITUDE_VERSES.length;
    renderVerse(currentVerseIndex);
  }

  function renderVerse(index) {
    const entry = GRATITUDE_VERSES[index];
    if (!entry) return;
    const localized = entry[currentLang] || entry.zh;
    verseTextEl.textContent = localized.text;
    verseRefEl.textContent = `${t().verseRefPrefix} ${localized.ref}`;
  }

  btnNextVerse.addEventListener("click", () => {
    if (!Array.isArray(GRATITUDE_VERSES) || GRATITUDE_VERSES.length <= 1) return;
    currentVerseIndex = (currentVerseIndex + 1) % GRATITUDE_VERSES.length;
    renderVerse(currentVerseIndex);
  });

  btnCollectVerse.addEventListener("click", () => {
    const entry = GRATITUDE_VERSES[currentVerseIndex];
    if (!entry) return;
    const localized = entry[currentLang] || entry.zh;
    const formatted =
      currentLang === "en"
        ? `${localized.text}\n— ${localized.ref} (${t().verseRefPrefix})`
        : `${localized.text}\n——${t().verseRefPrefix}${localized.ref}`;
    addNote("感恩恩典", formatted);
    showToast(t().toasts.collected);
  });

  /* ==================== localStorage 持久化 ==================== */

  function loadNotes() {
    const initialized = localStorage.getItem(STORAGE_INIT_KEY);
    const raw = localStorage.getItem(STORAGE_NOTES_KEY);

    if (!initialized) {
      notes = DEFAULT_NOTES.map((item) => ({ ...item }));
      saveNotes();
      localStorage.setItem(STORAGE_INIT_KEY, "1");
      return;
    }

    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        notes = Array.isArray(parsed) ? parsed : [];
      } catch {
        notes = [];
      }
    } else {
      notes = [];
    }
  }

  function saveNotes() {
    localStorage.setItem(STORAGE_NOTES_KEY, JSON.stringify(notes));
  }

  /* ==================== 便签增删与渲染 ==================== */

  function createIconSvg(type) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "icon");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.8");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");

    if (type === "download") {
      const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path1.setAttribute("d", "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4");
      const poly = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
      poly.setAttribute("points", "7 10 12 15 17 10");
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", "12");
      line.setAttribute("y1", "15");
      line.setAttribute("x2", "12");
      line.setAttribute("y2", "3");
      svg.append(path1, poly, line);
    } else if (type === "trash") {
      const poly = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
      poly.setAttribute("points", "3 6 5 6 21 6");
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", "M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2");
      svg.append(poly, path);
    }
    return svg;
  }

  function getNoteDisplayContent(note) {
    if (SAMPLE_TRANSLATIONS[note.id]) {
      return SAMPLE_TRANSLATIONS[note.id][currentLang] || note.content;
    }
    return note.content;
  }

  function getNoteDisplayDate(note) {
    if (note.id.startsWith("sample-")) {
      return t().sampleDate;
    }
    return note.date;
  }

  function getCategoryLabel(catKey) {
    return t().categories[catKey] || catKey;
  }

  function createNoteCardElement(note) {
    const card = document.createElement("article");
    card.className = "note-card";
    card.dataset.id = note.id;

    const meta = document.createElement("div");
    meta.className = "note-meta";

    const catBadge = document.createElement("span");
    catBadge.className = "note-category";
    catBadge.dataset.cat = note.category;
    catBadge.textContent = getCategoryLabel(note.category);

    const dateSpan = document.createElement("span");
    dateSpan.className = "note-date";
    dateSpan.textContent = getNoteDisplayDate(note);

    meta.append(catBadge, dateSpan);

    const contentP = document.createElement("p");
    contentP.className = "note-content";
    contentP.textContent = getNoteDisplayContent(note);

    const actions = document.createElement("div");
    actions.className = "note-actions";

    const btnSave = document.createElement("button");
    btnSave.type = "button";
    btnSave.className = "btn-card btn-save-img";
    btnSave.append(createIconSvg("download"), document.createTextNode(t().savePngBtn));
    btnSave.addEventListener("click", () => exportNoteAsPng(note, btnSave));

    const btnDel = document.createElement("button");
    btnDel.type = "button";
    btnDel.className = "btn-card btn-delete";
    btnDel.append(createIconSvg("trash"), document.createTextNode(t().deleteBtn));
    btnDel.addEventListener("click", () => deleteNote(note.id, card));

    actions.append(btnSave, btnDel);
    card.append(meta, contentP, actions);

    return card;
  }

  function getFilteredNotes() {
    if (activeFilter === "全部") return notes;
    return notes.filter((note) => note.category === activeFilter);
  }

  function renderNotes() {
    const visibleNotes = getFilteredNotes();
    notesGrid.textContent = "";
    visibleNotes.forEach((note) => {
      notesGrid.appendChild(createNoteCardElement(note));
    });
    updateBoardStatus(visibleNotes.length);
  }

  function updateBoardStatus(visibleCount = getFilteredNotes().length) {
    if (activeFilter === "全部") {
      notesCountEl.textContent = t().countAll(notes.length);
    } else {
      notesCountEl.textContent = t().countFiltered(visibleCount, notes.length);
    }

    if (visibleCount === 0) {
      if (notes.length > 0 && activeFilter !== "全部") {
        emptyTitleEl.textContent = t().emptyFilterTitle(getCategoryLabel(activeFilter));
        emptyDescEl.textContent = t().emptyFilterDesc;
      } else {
        emptyTitleEl.textContent = t().emptyTitle;
        emptyDescEl.textContent = t().emptyDesc;
      }
      emptyStateEl.classList.remove("hidden");
    } else {
      emptyStateEl.classList.add("hidden");
    }
  }

  function setActiveFilter(filterValue) {
    activeFilter = filterValue;
    filterTabs.forEach((tab) => {
      const isMatch = tab.dataset.filter === filterValue;
      tab.classList.toggle("active", isMatch);
      tab.setAttribute("aria-selected", isMatch ? "true" : "false");
    });
    renderNotes();
  }

  function addNote(category, rawContent) {
    const content = rawContent.trim();
    if (!content) {
      showToast(t().toasts.emptyInput);
      noteInput.focus();
      return false;
    }

    const newNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      category,
      content,
      date: formatShortDate()
    };

    notes.unshift(newNote);
    saveNotes();

    if (activeFilter !== "全部" && activeFilter !== category) {
      setActiveFilter("全部");
    } else {
      const cardEl = createNoteCardElement(newNote);
      notesGrid.prepend(cardEl);
      updateBoardStatus();
    }
    return true;
  }

  function deleteNote(id, cardEl) {
    cardEl.classList.add("is-removing");
    setTimeout(() => {
      notes = notes.filter((item) => item.id !== id);
      saveNotes();
      cardEl.remove();
      updateBoardStatus();
      showToast(t().toasts.removed);
    }, 240);
  }

  /* ==================== 导出单张便签为 PNG ==================== */

  async function exportNoteAsPng(note, triggerBtn) {
    if (typeof window.html2canvas !== "function") {
      showToast(t().toasts.noCanvas);
      return;
    }

    triggerBtn.disabled = true;
    showToast(t().toasts.generating);

    exportStage.textContent = "";
    const exportCard = document.createElement("div");
    exportCard.className = "export-card";

    const exportInner = document.createElement("div");
    exportInner.className = "export-inner";

    const header = document.createElement("div");
    header.className = "export-header";

    const catBadge = document.createElement("span");
    catBadge.className = "note-category";
    catBadge.dataset.cat = note.category;
    catBadge.textContent = getCategoryLabel(note.category);

    const dateSpan = document.createElement("span");
    dateSpan.className = "note-date";
    dateSpan.textContent = getNoteDisplayDate(note);

    header.append(catBadge, dateSpan);

    const content = document.createElement("p");
    content.className = "export-content";
    content.textContent = getNoteDisplayContent(note);

    const footer = document.createElement("div");
    footer.className = "export-footer";

    const brand = document.createElement("span");
    brand.textContent = t().exportBrand;
    const blessing = document.createElement("span");
    blessing.textContent = "GRACE & INSPIRATION";

    footer.append(brand, blessing);
    exportInner.append(header, content, footer);
    exportCard.appendChild(exportInner);
    exportStage.appendChild(exportCard);

    try {
      const canvas = await window.html2canvas(exportCard, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        logging: false
      });

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${t().exportFilePrefix}-${getTodayKey()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      link.remove();

      showToast(t().toasts.savedImg);
    } catch {
      showToast(t().toasts.imgError);
    } finally {
      exportStage.textContent = "";
      triggerBtn.disabled = false;
    }
  }

  /* ==================== 夜间护眼模式 & 中英文切换 ==================== */

  function updateThemeButtonLabel() {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    btnThemeToggle.setAttribute("aria-pressed", isDark ? "true" : "false");
    themeToggleLabel.textContent = isDark ? t().themeLight : t().themeDark;
  }

  function applyTheme(theme) {
    const isDark = theme === "dark";
    if (isDark) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.setAttribute("content", isDark ? "#111722" : "#1e3a5f");
    }
    updateThemeButtonLabel();
  }

  function initTheme() {
    applyTheme(localStorage.getItem(STORAGE_THEME_KEY) || "light");
  }

  function applyLanguage(lang) {
    currentLang = lang === "en" ? "en" : "zh";
    const dict = t();

    document.documentElement.lang = dict.htmlLang;
    document.title = dict.pageTitle;
    langToggleLabel.textContent = dict.langToggle;
    const installLabel = document.getElementById("install-app-label");
    if (installLabel) installLabel.textContent = dict.installApp;
    updateThemeButtonLabel();

    siteTitleEl.textContent = dict.siteTitle;
    siteSubtitleEl.textContent = `${formatDisplayDate()} · ${dict.subtitleSuffix}`;

    setButtonLabel(verseTagEl, dict.verseTag);
    setButtonLabel(btnNextVerse, dict.nextVerse);
    setButtonLabel(btnCollectVerse, dict.collectVerse);
    renderVerse(currentVerseIndex);

    composerLabelEl.textContent = dict.composerLabel;
    noteInput.placeholder = dict.placeholder;
    setButtonLabel(btnAddNote, dict.addNoteBtn);

    composerHintEl.textContent = "";
    const kbd1 = document.createElement("kbd");
    kbd1.textContent = "Ctrl";
    const kbd2 = document.createElement("kbd");
    kbd2.textContent = "⌘";
    const kbd3 = document.createElement("kbd");
    kbd3.textContent = "Enter";
    composerHintEl.append(
      `${dict.hintPrefix} `,
      kbd1,
      " / ",
      kbd2,
      " + ",
      kbd3,
      ` ${dict.hintSuffix}`
    );

    categoryPills.forEach((pill) => {
      const dot = pill.querySelector(".dot");
      const label = getCategoryLabel(pill.dataset.category);
      pill.textContent = "";
      if (dot) pill.appendChild(dot);
      pill.appendChild(document.createTextNode(label));
    });

    boardTitleEl.textContent = dict.boardTitle;
    filterTabs.forEach((tab) => {
      const f = tab.dataset.filter;
      tab.textContent = f === "全部" ? dict.filterAll : getCategoryLabel(f);
    });

    footerTextEl.textContent = dict.footer;
    renderNotes();
  }

  function initLanguage() {
    const savedLang = localStorage.getItem(STORAGE_LANG_KEY) || "zh";
    currentLang = savedLang === "en" ? "en" : "zh";
  }

  btnLangToggle.addEventListener("click", () => {
    const nextLang = currentLang === "zh" ? "en" : "zh";
    localStorage.setItem(STORAGE_LANG_KEY, nextLang);
    applyLanguage(nextLang);
    showToast(t().toasts.langSwitched);
  });

  btnThemeToggle.addEventListener("click", () => {
    const isCurrentlyDark = document.documentElement.getAttribute("data-theme") === "dark";
    const nextTheme = isCurrentlyDark ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem(STORAGE_THEME_KEY, nextTheme);
    showToast(nextTheme === "dark" ? t().toasts.darkOn : t().toasts.darkOff);
  });

  /* ==================== 事件绑定与初始化 ==================== */

  categoryPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      categoryPills.forEach((p) => {
        p.classList.remove("active");
        p.setAttribute("aria-checked", "false");
      });
      pill.classList.add("active");
      pill.setAttribute("aria-checked", "true");
      selectedCategory = pill.dataset.category;
    });
  });

  filterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      setActiveFilter(tab.dataset.filter);
    });
  });

  btnAddNote.addEventListener("click", () => {
    if (addNote(selectedCategory, noteInput.value)) {
      noteInput.value = "";
      showToast(t().toasts.added);
    }
  });

  noteInput.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      btnAddNote.click();
    }
  });

  /* ==================== PWA 安装与离线支持 ==================== */

  let deferredInstallPrompt = null;
  const btnInstallApp = document.getElementById("btn-install-app");

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    if (btnInstallApp) btnInstallApp.classList.remove("hidden");
  });

  if (btnInstallApp) {
    btnInstallApp.addEventListener("click", async () => {
      if (!deferredInstallPrompt) return;
      deferredInstallPrompt.prompt();
      const result = await deferredInstallPrompt.userChoice;
      if (result && result.outcome === "accepted") {
        btnInstallApp.classList.add("hidden");
      }
      deferredInstallPrompt = null;
    });
  }

  window.addEventListener("appinstalled", () => {
    if (btnInstallApp) btnInstallApp.classList.add("hidden");
    deferredInstallPrompt = null;
  });

  function registerServiceWorker() {
    const isHttp = location.protocol === "http:" || location.protocol === "https:";
    if (isHttp && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    }
  }

  function init() {
    initLanguage();
    initTheme();
    initDailyVerse();
    loadNotes();
    applyLanguage(currentLang);
    registerServiceWorker();
  }

  init();
})();
