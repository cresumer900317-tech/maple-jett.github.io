const API_URL =
  "https://script.google.com/macros/s/AKfycbzBH8keceX7BW4AzWNJ1Kw2pOJs0T8Copyd1T42H4BzpmUaCWJdVmEyT4CwL7gNDYRXKA/exec";

const appState = {
  source: "loading",
  homeData: window.DEFAULT_HOME_DATA || {}
};

const CACHE_TTL_MS = 5 * 60 * 1000;

document.addEventListener("DOMContentLoaded", () => {
  renderShell();
  bindMobileMenu();
});

function renderShell() {
  const root = document.getElementById("app-shell");
  if (!root) return;

  const page = document.body.dataset.page || "home";
  const links = `
    ${navLink("./index.html", "home", "홈", page)}
    ${navLink("./ranking.html", "ranking", "랭킹", page)}
    ${navLink("./members.html", "members", "인원·성장", page)}
    ${navLink("./notice.html", "notice", "공지", page)}
    ${navLink("./tips.html", "tips", "꿀팁", page)}
  `;

  root.innerHTML = `
    <header class="site-header-bar">
      <div class="container site-header-inner">
        <div class="brand-box">
          <a class="brand-title" href="./index.html">친구패밀리</a>
          <div class="brand-sub">Guild Portal</div>
        </div>

        <nav class="nav-menu">
          ${links}
        </nav>

        <button id="mobileMenuButton" class="mobile-menu-btn" type="button" aria-label="메뉴">☰</button>
      </div>
    </header>

    <div id="mobileDrawer" class="mobile-drawer">
      <nav class="mobile-drawer-nav">
        ${links}
      </nav>
    </div>
  `;
}

function bindMobileMenu() {
  document.addEventListener("click", (event) => {
    const button = document.getElementById("mobileMenuButton");
    const drawer = document.getElementById("mobileDrawer");
    if (!button || !drawer) return;

    if (event.target === button) {
      drawer.classList.toggle("is-open");
      return;
    }

    if (!drawer.contains(event.target)) {
      drawer.classList.remove("is-open");
    }
  });
}

function navLink(href, key, label, page) {
  return `<a class="nav-link ${page === key ? "is-active" : ""}" href="${href}">${label}</a>`;
}

function loadJsonp(baseUrl, mode = "home") {
  return new Promise((resolve, reject) => {
    const callbackName = `jsonp_callback_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const script = document.createElement("script");
    const url = new URL(baseUrl);

    url.searchParams.set("mode", mode);
    url.searchParams.set("callback", callbackName);
    url.searchParams.set("_ts", String(Date.now()));

    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error("JSONP 요청 시간 초과"));
    }, 15000);

    function cleanup() {
      clearTimeout(timeout);
      try {
        delete window[callbackName];
      } catch (_) {}
      if (script.parentNode) script.parentNode.removeChild(script);
    }

    window[callbackName] = (data) => {
      cleanup();
      resolve(data);
    };

    script.onerror = () => {
      cleanup();
      reject(new Error("JSONP 스크립트 로드 실패"));
    };

    script.src = url.toString();
    document.body.appendChild(script);
  });
}

function getCache(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.savedAt) return null;
    if (Date.now() - parsed.savedAt > CACHE_TTL_MS) {
      sessionStorage.removeItem(key);
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

function setCache(key, data) {
  try {
    sessionStorage.setItem(
      key,
      JSON.stringify({
        savedAt: Date.now(),
        data
      })
    );
  } catch (error) {
    console.warn("cache save 실패:", error);
  }
}

function normalizeHomeData(data) {
  return {
    ok: Boolean(data?.ok),
    meta: {
      generatedAt: data?.meta?.generatedAt ?? null,
      latestSnapshotAt: data?.meta?.latestSnapshotAt ?? null,
      weeklyBaseAt: data?.meta?.weeklyBaseAt ?? null,
      memberCount: Number(data?.meta?.memberCount ?? 0),
      weekRange: data?.meta?.weekRange ?? "-"
    },
    summary: {
      memberCount: Number(data?.summary?.memberCount ?? 0),
      avgLevel: Number(data?.summary?.avgLevel ?? 0),
      avgPowerText: data?.summary?.avgPowerText ?? "0",
      avgPopularity: Number(data?.summary?.avgPopularity ?? 0)
    },
    guilds: Array.isArray(data?.guilds) ? data.guilds : [],
    rankings: {
      power: Array.isArray(data?.rankings?.power) ? data.rankings.power : [],
      level: Array.isArray(data?.rankings?.level) ? data.rankings.level : [],
      popularity: Array.isArray(data?.rankings?.popularity) ? data.rankings.popularity : []
    },
    weeklyTop: {
      power: Array.isArray(data?.weeklyTop?.power) ? data.weeklyTop.power : [],
      level: Array.isArray(data?.weeklyTop?.level) ? data.weeklyTop.level : [],
      popularity: Array.isArray(data?.weeklyTop?.popularity) ? data.weeklyTop.popularity : []
    },
    members: Array.isArray(data?.members) ? data.members : []
  };
}

async function getHomeData() {
  const cacheKey = "friends_family_home_data_v140";
  const cached = getCache(cacheKey);

  if (cached) {
    appState.source = "api";
    appState.homeData = normalizeHomeData(cached);
    return appState.homeData;
  }

  try {
    const data = await loadJsonp(API_URL, "home");
    if (!data?.ok) throw new Error(data?.error || "API 응답 오류");
    setCache(cacheKey, data);
    appState.source = "api";
    appState.homeData = normalizeHomeData(data);
    return appState.homeData;
  } catch (error) {
    console.error("홈 데이터 로딩 실패:", error);
    appState.source = "fallback";
    appState.homeData = normalizeHomeData(window.DEFAULT_HOME_DATA || {});
    return appState.homeData;
  }
}

async function getNoticePosts() {
  const cacheKey = "friends_family_notice_posts_v140";
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const data = await loadJsonp(API_URL, "notice");
    if (!data?.ok) throw new Error("notice API error");
    const posts = Array.isArray(data.posts) ? data.posts : [];
    setCache(cacheKey, posts);
    return posts;
  } catch (error) {
    console.warn("공지 fallback 사용:", error);
    return window.DEFAULT_NOTICE_POSTS || [];
  }
}

async function getTipsPosts() {
  const cacheKey = "friends_family_tips_posts_v140";
  const cached = getCache(cacheKey);
  if (cached) return cached;

  try {
    const data = await loadJsonp(API_URL, "tips");
    if (!data?.ok) throw new Error("tips API error");
    const posts = Array.isArray(data.posts) ? data.posts : [];
    setCache(cacheKey, posts);
    return posts;
  } catch (error) {
    console.warn("꿀팁 fallback 사용:", error);
    return window.DEFAULT_TIPS_POSTS || [];
  }
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? "-";
}

function formatDateTimeCompact(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");

  return `${yyyy}.${mm}.${dd} ${hh}:${mi}`;
}

function formatDateOnly(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

function formatNumber(value) {
  return new Intl.NumberFormat("ko-KR").format(Number(value ?? 0));
}

function formatDecimal(value) {
  return new Intl.NumberFormat("ko-KR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(Number(value ?? 0));
}

function formatNullableRank(value) {
  if (value === null || value === undefined || value === "") return "-";
  return `${formatNumber(value)}위`;
}

function getRankBadgeClass(rank) {
  if (rank === 1) return "is-gold";
  if (rank === 2) return "is-silver";
  if (rank === 3) return "is-bronze";
  return "";
}

function getGuildClass(guild) {
  if (guild === "친구들") return "is-친구들";
  if (guild === "친구둘") return "is-친구둘";
  if (guild === "친구삼") return "is-친구삼";
  if (guild === "친구넷") return "is-친구넷";
  if (guild === "친구닷") return "is-친구닷";
  return "is-default";
}

function getDiffClass(value) {
  const numeric = Number(value || 0);
  if (numeric > 0) return "growth-positive";
  if (numeric < 0) return "growth-negative";
  return "growth-zero";
}

function getRankTrendClass(direction) {
  if (direction === "up") return "is-up";
  if (direction === "down") return "is-down";
  return "is-same";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderCharacterAvatar(imageUrl, name) {
  if (imageUrl) {
    return `
      <div class="character-avatar">
        <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(name || "캐릭터")}" loading="lazy" />
      </div>
    `;
  }

  return `
    <div class="character-avatar">
      <span class="character-avatar-fallback">NO IMG</span>
    </div>
  `;
}


function renderBoardList(targetId, posts) {
  const root = document.getElementById(targetId);
  if (!root) return;
  const items = Array.isArray(posts) ? posts : [];
  if (!items.length) {
    root.innerHTML = `<div class="empty-state">게시글이 없습니다.</div>`;
    return;
  }
  root.innerHTML = items.map((post) => `
    <article class="board-item">
      <div class="board-item-top">
        <div class="board-meta">
          <span class="board-badge">${escapeHtml(post.category || '게시글')}</span>
          <span>${escapeHtml(formatDateOnly(post.createdAt))}</span>
          ${post.isPinned ? '<span class="board-badge">고정</span>' : ''}
        </div>
        <div class="board-meta">${escapeHtml(post.author || '')}</div>
      </div>
      <h3 class="board-item-title">${escapeHtml(post.title || '-')}</h3>
      <div class="board-item-content">${escapeHtml(post.content || '')}</div>
    </article>
  `).join('');
}
