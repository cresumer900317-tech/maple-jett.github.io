document.addEventListener("DOMContentLoaded", async () => {
  const data = await getHomeData();
  renderRankingTable(data.rankings.power || [], "power");
  updateRankingSidebar("전투력");

  const tabs = document.getElementById("rankingTabs");
  tabs?.addEventListener("click", (event) => {
    const button = event.target.closest(".tab-btn");
    if (!button) return;

    tabs.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("is-active"));
    button.classList.add("is-active");

    const tab = button.dataset.tab;
    const label = tab === "power" ? "전투력" : tab === "level" ? "레벨" : "인기도";
    renderRankingTable(data.rankings[tab] || [], tab);
    updateRankingSidebar(label);
  });
});

function renderRankingTable(rows, tab = "power") {
  const tbody = document.getElementById("rankingTableBody");
  if (!tbody) return;

  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state">랭킹 데이터가 없습니다.</div></td></tr>`;
    return;
  }

  tbody.innerHTML = rows.slice(0, 50).map((row) => {
    const metricText =
      tab === "power"
        ? row.weeklyPowerDiffText || "0"
        : tab === "level"
          ? formatSignedNumber(row.weeklyLevelDiff)
          : formatSignedNumber(row.weeklyPopularityDiff);

    const metricValue =
      tab === "power"
        ? Number(row.weeklyPowerDiffValue || 0)
        : tab === "level"
          ? Number(row.weeklyLevelDiff || 0)
          : Number(row.weeklyPopularityDiff || 0);

    return `
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
        <td>${formatNumber(row.popularity)}</td>
        <td class="${getDiffClass(metricValue)}">${escapeHtml(metricText)}</td>
      </tr>
    `;
  }).join("");
}

function updateRankingSidebar(label) {
  const metric = document.getElementById("rankingMetricLabel");
  const api = document.getElementById("rankingApiText");
  if (metric) metric.textContent = label;
  if (api) api.textContent = appState.source === "api" ? "실시간 반영" : "fallback 반영";
}