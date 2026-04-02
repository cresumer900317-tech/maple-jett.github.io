const GUILD_META = {
  "친구들": { className: "guild-f1", label: "친구들" },
  "친구둘": { className: "guild-f2", label: "친구둘" },
  "친구삼": { className: "guild-f3", label: "친구삼" },
  "친구넷": { className: "guild-f4", label: "친구넷" },
  "친구닷": { className: "guild-f5", label: "친구닷" },
  "길드 없음": { className: "guild-none", label: "길드 없음" }
};

async function fetchLocalJson(filename) {
  const response = await fetch(`./data/${filename}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`데이터 파일을 불러오지 못했습니다: ${filename}`);
  }
  return response.json();
}

const getHomeData = () => fetchLocalJson("home-summary.json");
const getRankingData = () => fetchLocalJson("ranking.json");
const getWeeklyData = () => fetchLocalJson("weekly.json");
const getGuildsData = () => fetchLocalJson("members.json");
const getNoticeData = async () => ({ posts: [] });
const getTipsData = async () => ({ posts: [] });
const getHealthData = async () => ({ ok: true });

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatNumber(value) {
  const num = Number(value ?? 0);
  if (!Number.isFinite(num)) return "-";
  return new Intl.NumberFormat("ko-KR").format(num);
}

function formatDecimal(value, digits = 2) {
  const num = Number(value ?? 0);
  if (!Number.isFinite(num)) return "-";
  return num.toLocaleString("ko-KR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits
  });
}

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  const parts = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(date);
  const map = Object.fromEntries(parts.filter(p => p.type !== "literal").map(p => [p.type, p.value]));
  return `${map.year}.${map.month}.${map.day} ${map.hour}:${map.minute}`;
}

function formatCompactPower(text) {
  const raw = String(text || "").trim();
  if (!raw) return "-";
  const parts = raw.split(/\s+/).filter(Boolean);
  return parts.length <= 2 ? raw : parts.slice(0, 2).join(" ");
}

function fullPowerText(text) {
  const raw = String(text || "").trim();
  return raw || "-";
}

function normalizeGuildName(guild) {
  const text = String(guild || "").trim();
  return GUILD_META[text] ? text : "길드 없음";
}

function guildBadgeHtml(guild) {
  const normalized = normalizeGuildName(guild);
  const meta = GUILD_META[normalized];
  return `<span class="guild-badge ${meta.className}">${escapeHtml(meta.label)}</span>`;
}

function metricClass(value) {
  const text = String(value ?? "0").trim();
  const numeric = Number(text.replace(/[^\d+\-.]/g, ""));
  if (!Number.isFinite(numeric) || numeric === 0) return "metric-neutral";
  return numeric > 0 || text.startsWith("+") ? "metric-up" : "metric-down";
}

function metricHtml(value) {
  const text = String(value ?? "0").trim() || "0";
  return `<span class="${metricClass(text)}">${escapeHtml(text)}</span>`;
}

function rankTrendHtml(item) {
  const diff = Number(item?.weeklyRankDiff ?? item?.weeklyDiff ?? 0);
  const direction = item?.weeklyRankDirection || (diff > 0 ? "up" : diff < 0 ? "down" : "same");
  if (!diff || direction === "same") return `<span class="rank-trend neutral">-</span>`;
  if (direction === "up") return `<span class="rank-trend up">▲ ${Math.abs(diff)}</span>`;
  return `<span class="rank-trend down">▼ ${Math.abs(diff)}</span>`;
}

function navLink(href, key, label, currentPage) {
  const activeClass = currentPage === key ? "is-active" : "";
  return `<a class="nav-link ${activeClass}" href="${href}">${label}</a>`;
}

function renderShell() {
  const root = document.getElementById("app-shell");
  if (!root) return;
  const page = document.body.dataset.page || "home";
  const links = `
    ${navLink("./index.html", "home", "홈", page)}
    ${navLink("./ranking.html", "ranking", "전체랭킹", page)}
    ${navLink("./members.html", "members", "인원·성장", page)}
    ${navLink("./weekly.html", "weekly", "주간 TOP", page)}
    ${navLink("./notice.html", "notice", "공지", page)}
    ${navLink("./tips.html", "tips", "꿀팁", page)}
  `;

  root.innerHTML = `
    <header class="site-header-bar">
      <div class="container site-header-inner">
        <a class="brand-box" href="./index.html">
          <span class="brand-title">친구패밀리</span>
          <span class="brand-sub">Guild Ranking Portal</span>
        </a>
        <nav class="nav-menu">${links}</nav>
        <button id="mobileMenuButton" class="mobile-menu-btn" type="button" aria-label="메뉴 열기">☰</button>
      </div>
      <div id="mobileNavPanel" class="mobile-nav-panel">
        <div class="container mobile-nav-links">${links}</div>
      </div>
    </header>
  `;

  const mobileMenuButton = document.getElementById("mobileMenuButton");
  const mobileNavPanel = document.getElementById("mobileNavPanel");
  if (mobileMenuButton && mobileNavPanel) {
    mobileMenuButton.addEventListener("click", () => mobileNavPanel.classList.toggle("is-open"));
  }
}

function renderLoading(targetId, message = "불러오는 중...") {
  const el = document.getElementById(targetId);
  if (el) el.innerHTML = `<div class="loading-box">${escapeHtml(message)}</div>`;
}

function renderError(targetId, error) {
  const el = document.getElementById(targetId);
  if (el) el.innerHTML = `<div class="error-box">${escapeHtml(error?.message || "오류가 발생했습니다.")}</div>`;
}

function createEmptyBox(message = "데이터가 없습니다.") {
  return `<div class="empty-box">${escapeHtml(message)}</div>`;
}

function characterAvatarHtml(item) {
  const name = String(item?.name || "").trim();
  const imageUrl = `https://mgf.gg/ranking/ranking_image.php?n=${encodeURIComponent(name)}`;
  const fallback = escapeHtml((name || "?").slice(0, 1));
  return `
    <div class="character-avatar">
      <img src="${imageUrl}" alt="${escapeHtml(name)}" loading="lazy" referrerpolicy="no-referrer"
           onerror="this.parentElement.classList.add('no-image'); this.remove();" />
      <span class="avatar-fallback">${fallback}</span>
    </div>
  `;
}

function renderBoardList(posts, emptyMessage) {
  if (!Array.isArray(posts) || posts.length === 0) return createEmptyBox(emptyMessage);
  return `
    <div class="board-list">
      ${posts.map(post => `
        <article class="board-item">
          <div class="board-item-top">
            <span class="board-category">${escapeHtml(post.category || "게시글")}</span>
            ${post.isPinned ? `<span class="board-pin">고정</span>` : ""}
          </div>
          <h3 class="board-title">${escapeHtml(post.title || "")}</h3>
          <p class="board-content">${escapeHtml(post.content || "")}</p>
          <div class="board-meta">
            <span>${escapeHtml(post.author || "")}</span>
            <span>${escapeHtml(post.createdAt || "")}</span>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}
