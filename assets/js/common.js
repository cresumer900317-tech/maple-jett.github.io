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
  if (!response.ok) throw new Error(`API 요청 실패: ${response.status}`);
  const data = await response.json();
  if (!data || data.ok === false) throw new Error(data?.error || "API 오류");
  return data;
}

const getHomeData = () => fetchApi("home");
const getRankingData = () => fetchApi("ranking");
const getWeeklyData = () => fetchApi("weekly");

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatNumber(value) {
  return new Intl.NumberFormat("ko-KR").format(Number(value || 0));
}

function guildBadgeHtml(guild) {
  const meta = GUILD_META[guild] || GUILD_META["길드 없음"];
  return `<span class="guild-badge ${meta.className}">${meta.label}</span>`;
}

/* 🔥 핵심 수정 (이미지 자동 연결) */
function characterAvatarHtml(item) {
  const name = String(item?.name || "").trim();
  const encodedName = encodeURIComponent(name);

  const imageUrl = `https://mgf.gg/ranking/ranking_image.php?n=${encodedName}`;
  const fallback = escapeHtml((name || "?").slice(0, 1));

  return `
    <div class="character-avatar">
      <img src="${imageUrl}" alt="${escapeHtml(name)}"
           loading="lazy"
           referrerpolicy="no-referrer"
           onerror="this.parentElement.classList.add('no-image'); this.remove();" />
      <span class="avatar-fallback">${fallback}</span>
    </div>
  `;
}