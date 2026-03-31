document.addEventListener("DOMContentLoaded", async () => {
  const data = await getHomeData();

  setText("latestSnapshotAt", formatDateTime(data.meta.latestSnapshotAt));
  setText("weeklyBaseAt", formatDateTime(data.meta.weeklyBaseAt));
  setText("weekRange", data.meta.weekRange || "-");

  renderApiStatus();
  renderSummary(data.summary);
  renderHomeRankingPreview(data.rankings.power || []);
  renderGuilds(data.guilds);
  renderHomeWeeklyTop(data.weeklyTop.power || []);
  renderHomeNoticePreview(await getNoticePosts());
  renderFooter();
});

function renderApiStatus() {
  const badge = document.getElementById("apiStatus");
  if (!badge) return;

  badge.className = "status-badge";
  if (appState.source === "api") {
    badge.classList.add("is-ok");
    badge.textContent = "LIVE";
  } else {
    badge.classList.add("is-fallback");
    badge.textContent = "FALLBACK";
  }
}

function renderSummary(summary) {
  const root = document.getElementById("summaryCards");
  if (!root) return;

  const cards = [
    ["총 인원", formatNumber(summary.memberCount)],
    ["평균 레벨", formatDecimal(summary.avgLevel)],
    ["평균 전투력", summary.avgPowerText || "0"],
    ["평균 인기도", formatDecimal(summary.avgPopularity)]
  ];

  root.innerHTML = cards.map(([label, value]) => `
    <article class="summary-card">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </article>
  `).join("");
}

function renderHomeRankingPreview(rows) {
  const tbody = document.getElementById("homeRankingPreviewBody");
  if (!tbody) return;

  const preview = rows.slice(0, 10);
  if (!preview.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6"><div class="empty-state">랭킹 데이터가 없습니다.</div></td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = preview.map((row) => `
    <tr>
      <td><span class="rank-badge ${getRankBadgeClass(row.rank)}">${escapeHtml(String(row.rank ?? "-"))}</span></td>
      <td>
        <div class="name-cell">
          <span class="name-main">${escapeHtml(row.name || "-")}</span>
          <span class="name-sub">전체 ${formatNullableRank(row.overallRank)} / 서버 ${formatNullableRank(row.serverRank)}</span>
        </div>
      </td>
      <td><span class="guild-pill">${escapeHtml(row.guild || "길드 없음")}</span></td>
      <td>${formatNumber(row.level)}</td>
      <td>${escapeHtml(row.powerText || "0")}</td>
      <td class="${getDiffClass(row.weeklyPowerDiffValue)}">${escapeHtml(row.weeklyPowerDiffText || "0")}</td>
    </tr>
  `).join("");
}

function renderGuilds(guilds) {
  const root = document.getElementById("guildGrid");
  if (!root) return;

  if (!guilds.length) {
    root.innerHTML = `<div class="empty-state">길드 요약 데이터가 없습니다.</div>`;
    return;
  }

  root.innerHTML = guilds.map((guild) => `
    <article class="guild-card">
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
      </div>
    </article>
  `).join("");
}

function renderHomeWeeklyTop(rows) {
  const root = document.getElementById("homeWeeklyTop");
  if (!root) return;

  const top3 = rows.slice(0, 3);
  if (!top3.length) {
    root.innerHTML = `<div class="empty-state">주간 TOP 데이터가 없습니다.</div>`;
    return;
  }

  root.innerHTML = top3.map((row, index) => {
    const cls = getRankBadgeClass(index + 1);
    const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉";

    return `
      <article class="weekly-card">
        <div class="weekly-card-rank ${cls}">${medal}</div>
        <h3>${escapeHtml(row.name || "-")}</h3>
        <div class="sub-text">${escapeHtml(row.guild || "길드 없음")}</div>
        <div class="weekly-card-list">
          <div class="weekly-card-row">
            <div class="left">
              <strong>${escapeHtml(row.diffText || "0")}</strong>
              <span class="sub-text">${escapeHtml(`${row.powerText || "-"} · ${row.growthRateText || "0%"}`)}</span>
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

function renderHomeNoticePreview(posts) {
  renderBoardList("latestNoticeList", posts.slice(0, 3));
}

function renderFooter() {
  const footer = document.getElementById("footerApiText");
  if (!footer) return;
  footer.textContent = appState.source === "api"
    ? "실시간 연동: Apps Script API 사용 중"
    : "API 실패 시 fallback 데이터 사용 중";
}