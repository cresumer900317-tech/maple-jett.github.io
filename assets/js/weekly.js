document.addEventListener("DOMContentLoaded", async () => {
  if (typeof renderShell === "function") renderShell();
  if (typeof renderLoading === "function") {
    renderLoading("weekly-page", "주간 데이터를 불러오는 중...");
  } else {
    const root = document.getElementById("weekly-page");
    if (root) root.innerHTML = '<div class="panel"><p>주간 데이터를 불러오는 중...</p></div>';
  }

  try {
    const weekly = await fetchLocalJson("./data/weekly.json");
    const rows = Array.isArray(weekly) ? weekly.map((item, index) => normalizeWeeklyItem(item, index)) : [];
    const root = document.getElementById("weekly-page");
    if (!root) return;
    root.innerHTML = renderWeeklyPage(rows);
  } catch (error) {
    console.error(error);
    if (typeof renderError === "function") {
      renderError("weekly-page", error);
    } else {
      const root = document.getElementById("weekly-page");
      if (root) root.innerHTML = `<div class="panel"><p>데이터를 불러오지 못했습니다.</p><pre>${escapeHtml(String(error.message || error))}</pre></div>`;
    }
  }
});

async function fetchLocalJson(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`${path} 파일을 불러오지 못했습니다. (${response.status})`);
  }
  return response.json();
}

function normalizeWeeklyItem(item, index) {
  const rank = toNumber(item.rank, index + 1);
  const power = toNumber(item.power, 0);
  const weeklyDiff = toNumber(item.weekly_diff, 0);
  const currentLevel = toNumber(item.level || item.currentLevel, 0);
  return {
    ...item,
    rank,
    serverRank: toNumber(item.serverRank, rank),
    currentLevel,
    currentPowerText: item.powerText || formatNumber(power),
    powerDiffText: formatSignedNumber(weeklyDiff),
    growthRateText: `${calculateGrowthRate(power, weeklyDiff)}%`,
    levelDiffText: item.levelDiffText || "-",
    popularityDiffText: item.popularityDiffText || "-",
    weeklyRankDiffText: item.weeklyRankDiffText || "-"
  };
}

function renderWeeklyPage(rows) {
  const topPower = [...rows].sort((a, b) => toNumber(b.weekly_diff, 0) - toNumber(a.weekly_diff, 0)).slice(0, 5);
  const topLevel = [...rows].sort((a, b) => toNumber(b.level, 0) - toNumber(a.level, 0)).slice(0, 5);

  return `
    <div class="page-grid">
      <div class="home-middle">
        <section class="panel section-panel">
          <div class="panel-head">
            <div>
              <h1 class="panel-title">주간 전투력 TOP</h1>
              <p class="panel-subtitle">이번 주 전투력 상승 상위 5명</p>
            </div>
          </div>
          ${renderWeeklyTopList(topPower, "power")}
        </section>

        <section class="panel section-panel">
          <div class="panel-head">
            <div>
              <h2 class="panel-title">현재 레벨 TOP</h2>
              <p class="panel-subtitle">현재 레벨 기준 상위 5명</p>
            </div>
          </div>
          ${renderWeeklyTopList(topLevel, "level")}
        </section>
      </div>

      <section class="panel table-panel">
        <div class="panel-head">
          <div>
            <h2 class="panel-title">주간 성장 상세</h2>
            <p class="panel-subtitle">전체 멤버의 현재 수치와 주간 변화</p>
          </div>
        </div>
        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th class="col-character">캐릭터</th>
                <th class="col-guild">길드</th>
                <th class="col-center">현재 레벨</th>
                <th class="col-power">현재 전투력</th>
                <th class="col-center">전투력 증감</th>
                <th class="col-center">성장률</th>
                <th class="col-center">서버 순위</th>
                <th class="col-center">순위</th>
              </tr>
            </thead>
            <tbody>
              ${renderWeeklyRows(rows)}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `;
}

function renderWeeklyRows(rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return `
      <tr>
        <td colspan="8">${emptyBox("주간 데이터가 없습니다.")}</td>
      </tr>
    `;
  }

  return rows.map((item) => `
    <tr>
      <td class="col-character">
        <div class="character-cell">
          ${avatarHtml(item)}
          <div class="character-main">
            <div class="character-name-row"><span class="character-name">${escapeHtml(item.name || "-")}</span></div>
            <div class="character-sub"><span class="server">서버 ${escapeHtml(formatNumber(item.serverRank || item.rank || 0))}위</span></div>
          </div>
        </div>
      </td>
      <td class="col-guild">${badgeHtml(item.guild || "길드 없음")}</td>
      <td class="col-center">${escapeHtml(item.currentLevel ? `Lv ${formatNumber(item.currentLevel)}` : "-")}</td>
      <td class="col-power" title="${escapeHtml(item.currentPowerText || "-")}">${escapeHtml(item.currentPowerText || "-")}</td>
      <td class="col-center">${metricHtmlLocal(item.powerDiffText || "0")}</td>
      <td class="col-center">${metricHtmlLocal(item.growthRateText || "0%")}</td>
      <td class="col-center">${escapeHtml(formatNumber(item.serverRank || item.rank || 0))}위</td>
      <td class="col-center">${escapeHtml(formatNumber(item.rank || 0))}위</td>
    </tr>
  `).join("");
}

function renderWeeklyTopList(rows, type) {
  if (!Array.isArray(rows) || rows.length === 0) return emptyBox("데이터가 없습니다.");
  return `
    <div class="top-list">
      ${rows.map((item, index) => {
        const sub = type === "power"
          ? `${item.currentPowerText || "-"}`
          : `현재 Lv ${formatNumber(item.currentLevel || item.level || 0)}`;
        const value = type === "power"
          ? item.powerDiffText || "0"
          : `Lv ${formatNumber(item.currentLevel || item.level || 0)}`;
        return `
          <div class="top-item">
            <div class="top-rank">${index + 1}</div>
            <div>
              <div class="top-name">${escapeHtml(item.name || "-")}</div>
              <div class="top-sub">${badgeHtml(item.guild || "길드 없음")}<span>${escapeHtml(sub)}</span></div>
            </div>
            <div class="top-value">${metricHtmlLocal(value)}</div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function calculateGrowthRate(currentPower, weeklyDiff) {
  const current = toNumber(currentPower, 0);
  const diff = toNumber(weeklyDiff, 0);
  const prev = Math.max(current - diff, 0);
  if (prev <= 0 || diff === 0) return "0.00";
  return ((diff / prev) * 100).toFixed(2);
}

function formatSignedNumber(value) {
  const num = toNumber(value, 0);
  if (num > 0) return `+${formatNumber(num)}`;
  if (num < 0) return `-${formatNumber(Math.abs(num))}`;
  return "0";
}

function toNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function emptyBox(message) {
  if (typeof createEmptyBox === "function") return createEmptyBox(message);
  return `<div style="padding:24px; text-align:center; color:#9ca3af;">${escapeHtml(message)}</div>`;
}

function avatarHtml(item) {
  if (typeof characterAvatarHtml === "function") return characterAvatarHtml(item);
  const src = String(item?.image || "").trim();
  if (!src) return '<div class="avatar-fallback">-</div>';
  return `<img class="character-avatar" src="${escapeHtml(src)}" alt="${escapeHtml(item?.name || "캐릭터")}" loading="lazy" decoding="async" />`;
}

function badgeHtml(guild) {
  if (typeof guildBadgeHtml === "function") return guildBadgeHtml(guild);
  return `<span class="guild-badge">${escapeHtml(guild)}</span>`;
}

function metricHtmlLocal(value) {
  if (typeof metricHtml === "function") return metricHtml(String(value));
  return `<span>${escapeHtml(String(value))}</span>`;
}

function formatNumber(value) {
  if (typeof window.formatNumber === "function" && window.formatNumber !== formatNumber) {
    return window.formatNumber(value);
  }
  return new Intl.NumberFormat("ko-KR").format(toNumber(value, 0));
}

function escapeHtml(value) {
  if (typeof window.escapeHtml === "function" && window.escapeHtml !== escapeHtml) {
    return window.escapeHtml(value);
  }
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
