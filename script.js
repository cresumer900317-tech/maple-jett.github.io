const API_URL =
  "https://script.google.com/macros/s/AKfycbzBH8keceX7BW4AzWNJ1Kw2pOJs0T8Copyd1T42H4BzpmUaCWJdVmEyT4CwL7gNDYRXKA/exec";

const state = {
  source: "loading",
  data: window.DEFAULT_HOME_DATA || {},
  rankingTab: "power",
  weeklyTab: "power",
  memberSearch: "",
  guildFilter: "ALL",
  memberSort: "power"
};

document.addEventListener("DOMContentLoaded", async () => {
  bindEvents();
  await loadHomeData();
  renderAll();
});

function bindEvents() {
  const rankingTabs = document.getElementById("rankingTabs");
  const weeklyTabs = document.getElementById("weeklyTabs");
  const memberSearchInput = document.getElementById("memberSearchInput");
  const guildFilterSelect = document.getElementById("guildFilterSelect");
  const sortSelect = document.getElementById("sortSelect");

  rankingTabs?.addEventListener("click", (event) => {
    const button = event.target.closest(".tab-btn");
    if (!button) return;
    state.rankingTab = button.dataset.tab;
    updateActiveTabs(rankingTabs, state.rankingTab);
    renderRankingTable();
  });

  weeklyTabs?.addEventListener("click", (event) => {
    const button = event.target.closest(".tab-btn");
    if (!button) return;
    state.weeklyTab = button.dataset.tab;
    updateActiveTabs(weeklyTabs, state.weeklyTab);
    renderWeeklyTop();
  });

  memberSearchInput?.addEventListener("input", (event) => {
    state.memberSearch = String(event.target.value || "").trim().toLowerCase();
    renderMembers();
  });

  guildFilterSelect?.addEventListener("change", (event) => {
    state.guildFilter = event.target.value;
    renderMembers();
  });

  sortSelect?.addEventListener("change", (event) => {
    state.memberSort = event.target.value;
    renderMembers();
  });
}

async function loadHomeData() {
  setApiStatus("loading");

  try {
    const data = await loadJsonp(API_URL, "home");

    if (!data?.ok) {
      throw new Error(data?.error || "API 응답 오류");
    }

    state.data = normalizeHomeData(data);
    state.source = "api";
    setApiStatus("ok");
  } catch (error) {
    console.error("API 로딩 실패:", error);
    state.data = normalizeHomeData(window.DEFAULT_HOME_DATA || {});
    state.source = "fallback";
    setApiStatus("fallback");
  }
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
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
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
      avgPopularity: Number(data?.summary?.avgPopularity ?? 0),
      positiveGrowthMembers: {
        power: Number(data?.summary?.positiveGrowthMembers?.power ?? 0),
        level: Number(data?.summary?.positiveGrowthMembers?.level ?? 0),
        popularity: Number(data?.summary?.positiveGrowthMembers?.popularity ?? 0)
      }
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

function renderAll() {
  renderMeta();
  renderSummary();
  renderGuilds();
  renderRankingTable();
  renderWeeklyTop();
  renderGuildFilterOptions();
  renderMembers();
  renderFooter();
}

function renderMeta() {
  const { meta } = state.data;
  setText("latestSnapshotAt", formatDateTime(meta.latestSnapshotAt));
  setText("weeklyBaseAt", formatDateTime(meta.weeklyBaseAt));
  setText("weekRange", meta.weekRange || "-");
}

function renderSummary() {
  const container = document.getElementById("summaryCards");
  const summary = state.data.summary;
  if (!container) return;

  const cards = [
    { label: "총 인원", value: formatNumber(summary.memberCount) },
    { label: "평균 레벨", value: formatDecimal(summary.avgLevel) },
    { label: "평균 전투력", value: summary.avgPowerText || "0" },
    { label: "평균 인기도", value: formatDecimal(summary.avgPopularity) }
  ];

  container.innerHTML = cards.map((card) => `
    <article class="summary-card">
      <span>${escapeHtml(card.label)}</span>
      <strong>${escapeHtml(card.value)}</strong>
    </article>
  `).join("");
}

function renderGuilds() {
  const container = document.getElementById("guildGrid");
  const guilds = state.data.guilds || [];
  if (!container) return;

  if (!guilds.length) {
    container.innerHTML = `<div class="empty-state">길드 요약 데이터가 없습니다.</div>`;
    return;
  }

  container.innerHTML = guilds.map((guild) => `
    <article class="guild-card ${getGuildClassName(guild.guild)}">
      <h3>${escapeHtml(guild.guild || "길드 없음")}</h3>
      <div class="guild-stats">
        <div class="guild-stat-row">
          <span class="guild-stat-label">인원수</span>
          <strong class="guild-stat-value">${formatNumber(guild.memberCount)}</strong>
        </div>
        <div class="guild-stat-row">
          <span class="guild-stat-label">평균 레벨</span>
          <strong class="guild-stat-value">${formatDecimal(guild.avgLevel)}</strong>
        </div>
        <div class="guild-stat-row">
          <span class="guild-stat-label">평균 전투력</span>
          <strong class="guild-stat-value">${escapeHtml(guild.avgPowerText || "0")}</strong>
        </div>
        <div class="guild-stat-row">
          <span class="guild-stat-label">평균 인기도</span>
          <strong class="guild-stat-value">${formatDecimal(guild.avgPopularity)}</strong>
        </div>
        <div class="guild-stat-row">
          <span class="guild-stat-label">주간 전투력 증감</span>
          <strong class="guild-stat-value ${getDiffClass(guild.weeklyPowerDiffValue)}">
            ${escapeHtml(guild.weeklyPowerDiffText || "0")}
          </strong>
        </div>
        <div class="guild-stat-row">
          <span class="guild-stat-label">주간 레벨업 인원</span>
          <strong class="guild-stat-value">${formatNumber(guild.weeklyLevelUpCount)}</strong>
        </div>
      </div>
    </article>
  `).join("");
}

function renderRankingTable() {
  const tbody = document.getElementById("rankingTableBody");
  const rows = state.data.rankings?.[state.rankingTab] || [];
  if (!tbody) return;

  if (!rows.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7"><div class="empty-state">랭킹 데이터가 없습니다.</div></td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = rows.slice(0, 30).map((row) => {
    const rankClass = getRankBadgeClass(row.rank);
    const metricText =
      state.rankingTab === "power"
        ? row.weeklyPowerDiffText || "0"
        : state.rankingTab === "level"
          ? formatSignedNumber(row.weeklyLevelDiff)
          : formatSignedNumber(row.weeklyPopularityDiff);

    const metricValue =
      state.rankingTab === "power"
        ? Number(row.weeklyPowerDiffValue || 0)
        : state.rankingTab === "level"
          ? Number(row.weeklyLevelDiff || 0)
          : Number(row.weeklyPopularityDiff || 0);

    return `
      <tr>
        <td><span class="rank-badge ${rankClass}">${escapeHtml(String(row.rank ?? "-"))}</span></td>
        <td>
          <div class="name-cell">
            <span class="name-main">${escapeHtml(row.name || "-")}</span>
            <span class="name-sub">전체 ${formatNullableRank(row.overallRank)} / 서버 ${formatNullableRank(row.serverRank)}</span>
          </div>
        </td>
        <td>
          <span class="guild-pill ${getGuildClassName(row.guild)}">${escapeHtml(row.guild || "길드 없음")}</span>
        </td>
        <td>${formatNumber(row.level)}</td>
        <td>${escapeHtml(row.powerText || "0")}</td>
        <td>${formatNumber(row.popularity)}</td>
        <td class="${getDiffClass(metricValue)}">${escapeHtml(metricText)}</td>
      </tr>
    `;
  }).join("");
}

function renderWeeklyTop() {
  const container = document.getElementById("weeklyTopGrid");
  const rows = state.data.weeklyTop?.[state.weeklyTab] || [];
  if (!container) return;

  if (!rows.length) {
    container.innerHTML = `<div class="empty-state">주간 TOP 데이터가 없습니다.</div>`;
    return;
  }

  container.innerHTML = rows.slice(0, 3).map((row, index) => {
    const title =
      state.weeklyTab === "power"
        ? row.diffText || "0"
        : row.diffText || formatSignedNumber(row.diff);

    const extra =
      state.weeklyTab === "power"
        ? `${row.powerText || "-"} · ${row.growthRateText || "0%"}`
        : state.weeklyTab === "level"
          ? `현재 레벨 ${formatNumber(row.currentLevel)}`
          : `현재 인기도 ${formatNumber(row.currentPopularity)}`;

    return `
      <article class="weekly-card">
        <div class="weekly-card-rank">${index + 1}</div>
        <h3>${escapeHtml(row.name || "-")}</h3>
        <div class="sub-text">${escapeHtml(row.guild || "길드 없음")}</div>
        <div class="weekly-card-list">
          <div class="weekly-card-row">
            <div class="left">
              <strong>${escapeHtml(title)}</strong>
              <span class="sub-text">${escapeHtml(extra)}</span>
            </div>
            <div class="right">
              <div>전체 ${formatNullableRank(row.overallRank)}</div>
              <div>서버 ${formatNullableRank(row.serverRank)}</div>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function renderGuildFilterOptions() {
  const select = document.getElementById("guildFilterSelect");
  if (!select) return;

  const guilds = (state.data.guilds || []).map((guild) => guild.guild).filter(Boolean);
  const uniqueGuilds = ["ALL", ...new Set(guilds)];

  select.innerHTML = uniqueGuilds.map((guild) => {
    const label = guild === "ALL" ? "전체 길드" : guild;
    return `<option value="${escapeHtml(guild)}">${escapeHtml(label)}</option>`;
  }).join("");

  select.value = state.guildFilter;
}

function renderMembers() {
  const container = document.getElementById("membersGrid");
  const emptyState = document.getElementById("membersEmptyState");
  if (!container || !emptyState) return;

  let members = [...(state.data.members || [])];

  if (state.memberSearch) {
    members = members.filter((member) =>
      String(member.name || "").toLowerCase().includes(state.memberSearch)
    );
  }

  if (state.guildFilter !== "ALL") {
    members = members.filter((member) => (member.guild || "길드 없음") === state.guildFilter);
  }

  members.sort((a, b) => compareMembers(a, b, state.memberSort));

  if (!members.length) {
    container.innerHTML = "";
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  container.innerHTML = members.map((member) => {
    const weekly = member.weekly || {};
    return `
      <article class="member-card">
        <div class="member-top">
          <div>
            <div class="member-rank">
              <span>패밀리 전투력 순위</span>
              <strong>#${formatNumber(member.familyRankByPower)}</strong>
            </div>
            <h3 class="member-name">${escapeHtml(member.name || "-")}</h3>
            <div class="member-real-guild">${escapeHtml(member.realGuild || "길드 없음")}</div>
          </div>
          <span class="guild-pill ${getGuildClassName(member.guild)}">${escapeHtml(member.guild || "길드 없음")}</span>
        </div>

        <div class="member-stats">
          <div class="member-stat">
            <span class="member-stat-label">레벨</span>
            <strong class="member-stat-value">${formatNumber(member.level)}</strong>
          </div>
          <div class="member-stat">
            <span class="member-stat-label">전투력</span>
            <strong class="member-stat-value">${escapeHtml(member.powerText || "0")}</strong>
          </div>
          <div class="member-stat">
            <span class="member-stat-label">인기도</span>
            <strong class="member-stat-value">${formatNumber(member.popularity)}</strong>
          </div>
          <div class="member-stat">
            <span class="member-stat-label">주간 전투력</span>
            <strong class="member-stat-value ${getDiffClass(weekly.powerDiffValue)}">${escapeHtml(weekly.powerDiffText || "0")}</strong>
          </div>
          <div class="member-stat">
            <span class="member-stat-label">주간 레벨</span>
            <strong class="member-stat-value ${getDiffClass(weekly.levelDiff)}">${escapeHtml(weekly.levelDiffText || "0")}</strong>
          </div>
          <div class="member-stat">
            <span class="member-stat-label">주간 인기도</span>
            <strong class="member-stat-value ${getDiffClass(weekly.popularityDiff)}">${escapeHtml(weekly.popularityDiffText || "0")}</strong>
          </div>
          <div class="member-stat">
            <span class="member-stat-label">주간 성장률</span>
            <strong class="member-stat-value">${escapeHtml(weekly.growthRateText || "0%")}</strong>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function renderFooter() {
  const footer = document.getElementById("footerApiText");
  if (!footer) return;

  if (state.source === "api") {
    footer.textContent = "실시간 연동: Apps Script API 사용 중";
    return;
  }

  if (state.source === "fallback") {
    footer.textContent = "API 실패 시 fallback 데이터 사용 중";
    return;
  }

  footer.textContent = "API 연결 대기 중";
}

function updateActiveTabs(wrapper, activeTab) {
  const buttons = wrapper.querySelectorAll(".tab-btn");
  buttons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tab === activeTab);
  });
}

function setApiStatus(status) {
  const badge = document.getElementById("apiStatus");
  if (!badge) return;

  badge.className = "status-badge";

  if (status === "loading") {
    badge.classList.add("is-loading");
    badge.textContent = "LOADING";
    return;
  }

  if (status === "ok") {
    badge.classList.add("is-ok");
    badge.textContent = "LIVE";
    return;
  }

  if (status === "fallback") {
    badge.classList.add("is-fallback");
    badge.textContent = "FALLBACK";
    return;
  }

  badge.classList.add("is-error");
  badge.textContent = "ERROR";
}

function compareMembers(a, b, sortKey) {
  if (sortKey === "level") return Number(b.level || 0) - Number(a.level || 0);
  if (sortKey === "popularity") return Number(b.popularity || 0) - Number(a.popularity || 0);
  if (sortKey === "name") return String(a.name || "").localeCompare(String(b.name || ""), "ko");
  return Number(b.powerValue || 0) - Number(a.powerValue || 0);
}

function getRankBadgeClass(rank) {
  if (rank === 1) return "is-gold";
  if (rank === 2) return "is-silver";
  if (rank === 3) return "is-bronze";
  return "";
}

function getGuildClassName(guildName) {
  const normalized = String(guildName || "길드 없음").replace(/\s+/g, "");
  if (normalized === "길드없음") return "is-길드없음";
  return `is-${normalized}`;
}

function getDiffClass(value) {
  const numeric = Number(value || 0);
  if (numeric > 0) return "growth-positive";
  if (numeric < 0) return "growth-negative";
  return "growth-zero";
}

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
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

function formatSignedNumber(value) {
  const numeric = Number(value ?? 0);
  if (numeric > 0) return `+${formatNumber(numeric)}`;
  if (numeric < 0) return `${formatNumber(numeric)}`;
  return "0";
}

function formatNullableRank(value) {
  if (value === null || value === undefined || value === "") return "-";
  return `${formatNumber(value)}위`;
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (!element) return;
  element.textContent = value ?? "-";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}