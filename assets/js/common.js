const API_URL = "https://script.google.com/macros/s/AKfycbzBH8keceX7BW4AzWNJ1Kw2pOJs0T8Copyd1T42H4BzpmUaCWJdVmEyT4CwL7gNDYRXKA/exec";

const GUILD_META = {
  "친구들": { className: "guild-f1", label: "친구들" },
  "친구둘": { className: "guild-f2", label: "친구둘" },
  "친구삼": { className: "guild-f3", label: "친구삼" },
  "친구넷": { className: "guild-f4", label: "친구넷" },
  "친구닷": { className: "guild-f5", label: "친구닷" },
  "길드 없음": { className: "guild-none", label: "길드 없음" }
};

function getApiUrl(mode) {
  const url = new URL(API_URL);
  url.searchParams.set("mode", mode);
  return url.toString();
}

async function fetchApi(mode) {
  const response = await fetch(getApiUrl(mode), { method: "GET", cache: "no-store" });
  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status}`);
  }
  const data = await response.json();
  if (!data || data.ok === false) {
    throw new Error(data?.error || "API 응답이 올바르지 않습니다.");
  }
  return data;
}

const getHomeData = () => fetchApi("home");
const getRankingData = () => fetchApi("ranking");
const getWeeklyData = () => fetchApi("weekly");
const getGuildsData = () => fetchApi("guilds");
const getNoticeData = () => fetchApi("notice");
const getTipsData = () => fetchApi("tips");
const getHealthData = () => fetchApi("health");

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
  const diff = Number(item?.weeklyRankDiff ?? 0);
  const direction = item?.weeklyRankDirection || "same";
  if (!diff || direction === "same") return `<span class="rank-trend neutral">-</span>`;
  if (direction === "up") return `<span class="rank-trend up">▲ ${diff}</span>`;
  return `<span class="rank-trend down">▼ ${diff}</span>`;
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
    <header class="site-header">
      <div class="container site-header-inner">
        <a class="brand" href="./index.html">
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
  if (el) el.innerHTML = `<div class="state-box">${escapeHtml(message)}</div>`;
}

function renderError(targetId, error) {
  const el = document.getElementById(targetId);
  if (el) el.innerHTML = `<div class="state-box state-error">${escapeHtml(error?.message || "오류가 발생했습니다.")}</div>`;
}

function createEmptyBox(message = "데이터가 없습니다.") {
  return `<div class="state-box">${escapeHtml(message)}</div>`;
}

function characterAvatarHtml(item) {
  const imageUrl = String(item?.imageUrl || "").trim();
  const name = String(item?.name || "").trim();
  const fallback = escapeHtml((name || "?").slice(0, 1));
  if (!imageUrl) return `<div class="character-avatar no-image"><span>${fallback}</span></div>`;
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
          <div class="board-top">
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
