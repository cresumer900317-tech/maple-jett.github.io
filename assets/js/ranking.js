document.addEventListener("DOMContentLoaded", async () => {
  const data = await getHomeData();
  const state = {
    tab: "power",
    rows: data.rankings.power || []
  };

  renderRankingTable(state.rows, state.tab);
  updateRankingSidebar("전투력", state.rows.length);

  const tabs = document.getElementById("rankingTabs");
  const searchInput = document.getElementById("rankingSearchInput");
  const searchButton = document.getElementById("rankingSearchButton");

  tabs?.addEventListener("click", (event) => {
    const button = event.target.closest(".tab-btn");
    if (!button) return;

    tabs.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("is-active"));
    button.classList.add("is-active");

    state.tab = button.dataset.tab;
    state.rows = data.rankings[state.tab] || [];
    renderRankingTable(state.rows, state.tab);
    updateRankingSidebar(getMetricLabel(state.tab), state.rows.length);
    resetSearchStatus();
  });

  searchButton?.addEventListener("click", () => {
    performRankingSearch(state.rows);
  });

  searchInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      performRankingSearch(state.rows);
    }
  });
});

function renderRankingTable(rows, tab = "power") {
  const tbody = document.getElementById("rankingTableBody");
  if (!tbody) return;

  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state">랭킹 데이터가 없습니다.</div></td></tr>`;
    return;
  }

  tbody.innerHTML = rows.map((row, index) => {
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
      <tr data-rank-index="${index}" data-name="${escapeHtml(String(row.name || "").toLowerCase())}">
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

function performRankingSearch(rows) {
  const input = document.getElementById("rankingSearchInput");
  const status = document.getElementById("rankingSearchStatus");
  const scrollArea = document.getElementById("rankingScrollArea");
  const tbody = document.getElementById("rankingTableBody");
  if (!input || !status || !scrollArea || !tbody) return;

  const keyword = String(input.value || "").trim().toLowerCase();
  clearRankingHighlights();

  if (!keyword) {
    status.textContent = "검색어를 입력해 주세요.";
    return;
  }

  const matchIndex = rows.findIndex((row) =>
    String(row.name || "").toLowerCase().includes(keyword)
  );

  if (matchIndex === -1) {
    status.textContent = "검색 결과가 없습니다.";
    return;
  }

  const targetRow = tbody.querySelector(`tr[data-rank-index="${matchIndex}"]`);
  if (!targetRow) {
    status.textContent = "검색 결과가 없습니다.";
    return;
  }

  const rowsEls = [...tbody.querySelectorAll("tr")];
  rowsEls.forEach((rowEl, index) => {
    if (index === matchIndex) rowEl.classList.add("is-target");
    if (index >= matchIndex - 2 && index <= matchIndex + 2) rowEl.classList.add("is-context");
  });

  const offsetTop = targetRow.offsetTop - scrollArea.clientHeight / 2 + targetRow.clientHeight * 2;
  scrollArea.scrollTo({
    top: Math.max(offsetTop, 0),
    behavior: "smooth"
  });

  status.textContent = `검색 결과: ${rows[matchIndex].name} · ${matchIndex + 1}위 근처로 이동했습니다.`;
}

function clearRankingHighlights() {
  document.querySelectorAll("#rankingTableBody tr").forEach((tr) => {
    tr.classList.remove("is-target", "is-context");
  });
}

function resetSearchStatus() {
  const status = document.getElementById("rankingSearchStatus");
  const input = document.getElementById("rankingSearchInput");
  if (status) status.textContent = "검색하면 해당 순위 근처로 이동합니다.";
  if (input) input.value = "";
  clearRankingHighlights();
}

function updateRankingSidebar(label, count) {
  const metric = document.getElementById("rankingMetricLabel");
  const api = document.getElementById("rankingApiText");
  const countLabel = document.getElementById("rankingCountLabel");

  if (metric) metric.textContent = label;
  if (countLabel) countLabel.textContent = `${formatNumber(count)}명`;
  if (api) api.textContent = appState.source === "api" ? "실시간 반영" : "fallback 반영";
}

function getMetricLabel(tab) {
  if (tab === "level") return "레벨";
  if (tab === "popularity") return "인기도";
  return "전투력";
}