document.addEventListener("DOMContentLoaded", async () => {
  renderShell();
  renderLoading("ranking-page", "랭킹 데이터를 불러오는 중...");

  try {
    const data = await getRankingData();
    const rankings = Array.isArray(data?.rankings?.power) ? data.rankings.power : [];
    const root = document.getElementById("ranking-page");
    root.innerHTML = renderRankingPage(rankings, data?.latestSnapshotAt || null);
    bindRankingSearch(rankings);
  } catch (error) {
    console.error(error);
    renderError("ranking-page", error);
  }
});

function renderRankingPage(rows, latestSnapshotAt) {
  return `
    <div class="panel table-panel">
      <div class="panel-head">
        <div>
          <h1 class="panel-title">전체 순위표</h1>
          <p class="panel-subtitle">마지막 갱신 ${escapeHtml(formatDateTime(latestSnapshotAt))}</p>
        </div>
      </div>
      <div class="search-row">
        <label class="search-box"><span>🔎</span><input id="rankingSearchInput" type="text" placeholder="캐릭터명 검색" /></label>
        <button id="rankingSearchReset" class="button-secondary" type="button">초기화</button>
      </div>
      <div class="table-wrap">
        <table class="table" id="rankingTable">
          <thead>
            <tr>
              <th class="col-rank">순위</th>
              <th class="col-character">캐릭터</th>
              <th class="col-guild">길드</th>
              <th class="col-center">Lv</th>
              <th class="col-power">전투력</th>
              <th class="col-center">인기도</th>
              <th class="col-center">서버 순위 변화</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map((item, index) => renderRankingRow(item, index + 1)).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderRankingRow(item, rank) {
  const rankClass = rank === 1 ? "rank-1" : rank === 2 ? "rank-2" : rank === 3 ? "rank-3" : "rank-normal";
  return `
    <tr data-name="${escapeHtml((item.name || "").toLowerCase())}">
      <td class="col-rank"><span class="rank-badge ${rankClass}">${rank}</span></td>
      <td class="col-character">
        <div class="character-cell">
          ${characterAvatarHtml(item)}
          <div class="character-main">
            <div class="character-name-row"><span class="character-name">${escapeHtml(item.name || "-")}</span></div>
            <div class="character-sub">
              <span class="server">서버 ${escapeHtml(formatNumber(item.serverRank || 0))}위</span>
              <span>전체 ${escapeHtml(formatNumber(item.overallRank || 0))}위</span>
            </div>
          </div>
        </div>
      </td>
      <td class="col-guild">${guildBadgeHtml(item.guild || "길드 없음")}</td>
      <td class="col-center">${escapeHtml(formatNumber(item.level || 0))}</td>
      <td class="col-power" title="${escapeHtml(item.powerText || "-")}">${escapeHtml(item.powerText || "-")}</td>
      <td class="col-center">${escapeHtml(formatNumber(item.popularity || 0))}</td>
      <td class="col-center">${rankTrendHtml(item)}</td>
    </tr>
  `;
}

function bindRankingSearch(rows) {
  const input = document.getElementById("rankingSearchInput");
  const reset = document.getElementById("rankingSearchReset");
  const tbody = document.querySelector("#rankingTable tbody");
  if (!input || !tbody) return;

  const applyFilter = () => {
    const keyword = input.value.trim().toLowerCase();
    const trs = Array.from(tbody.querySelectorAll("tr"));
    let highlighted = false;
    trs.forEach((tr) => {
      const name = tr.dataset.name || "";
      const matched = !keyword || name.includes(keyword);
      tr.style.display = matched ? "" : "none";
      tr.classList.remove("table-highlight");
      if (keyword && matched && !highlighted) {
        tr.classList.add("table-highlight");
        highlighted = true;
        tr.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  };

  input.addEventListener("input", applyFilter);
  reset?.addEventListener("click", () => {
    input.value = "";
    applyFilter();
  });
}
