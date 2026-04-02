document.addEventListener("DOMContentLoaded", async () => {
  renderShell();

  const root = document.getElementById("ranking-page");
  if (!root) return;

  renderLoading("ranking-page", "랭킹 데이터를 불러오는 중...");

  try {
    const data = await getRankingData();
    root.innerHTML = renderRankingPage(data);
    bindRankingEvents(data);
  } catch (error) {
    console.error(error);
    renderError("ranking-page", error);
  }
});

function renderRankingPage(data) {
  const rankings = Array.isArray(data?.rankings?.power) ? data.rankings.power : [];
  const updatedAt = data?.latestSnapshotAt || data?.updatedAt || null;

  return `
    <section class="section-card">
      <div class="section-header">
        <div>
          <h1 class="section-title">전체 순위표</h1>
          <p class="section-subtitle">길드원 서버 순위 기준 정렬</p>
        </div>
      </div>

      <div class="table-toolbar">
        <div class="value-soft">마지막 갱신 ${escapeHtml(formatDateTime(updatedAt))}</div>

        <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
          <label class="search-box">
            <span>🔎</span>
            <input
              id="rankingSearchInput"
              type="text"
              placeholder="캐릭터명 검색"
              autocomplete="off"
            />
          </label>
          <button id="rankingResetButton" class="detail-btn" type="button">초기화</button>
        </div>
      </div>

      <div class="table-scroll">
        <table class="ranking-table">
          <thead>
            <tr>
              <th class="col-rank">순위</th>
              <th class="col-character">캐릭터</th>
              <th class="col-guild">길드</th>
              <th class="col-lv">Lv</th>
              <th class="col-power">전투력</th>
              <th class="col-pop">인기도</th>
              <th class="col-diff">순위 변화</th>
              <th class="col-action">상세</th>
            </tr>
          </thead>
          <tbody id="rankingTableBody">
            ${renderRankingRows(rankings)}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderRankingRows(rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return `
      <tr>
        <td colspan="8">
          ${createEmptyBox("랭킹 데이터가 없습니다.")}
        </td>
      </tr>
    `;
  }

  return rows.map((item, index) => {
    const displayRank = Number(item.serverRank || index + 1);
    const medalClass =
      index === 0 ? "top1" :
      index === 1 ? "top2" :
      index === 2 ? "top3" : "normal";

    return `
      <tr data-character-row="${escapeHtml(String(item.name || "").toLowerCase())}">
        <td class="col-rank">
          <span class="rank-medal ${medalClass}">${escapeHtml(String(displayRank))}</span>
        </td>

        <td class="col-character">
          <div class="character-cell">
            ${characterAvatarHtml(item)}

            <div class="character-main">
              <div class="character-name-row">
                <span class="character-name">${escapeHtml(item.name || "-")}</span>
              </div>

              <div class="character-sub">
                <span class="emphasis-rank">서버 ${escapeHtml(String(item.serverRank || "-"))}위</span>
                ${item.weeklyRankDiffText ? rankTrendHtml(item) : `<span class="rank-trend neutral">-</span>`}
              </div>
            </div>
          </div>
        </td>

        <td class="col-guild">
          ${guildBadgeHtml(item.guild || "길드 없음")}
        </td>

        <td class="col-lv">
          <span class="value-strong">Lv ${escapeHtml(String(item.level || "-"))}</span>
        </td>

        <td class="col-power">
          <span class="value-strong">${escapeHtml(fullPowerText(item.powerText || "-"))}</span>
        </td>

        <td class="col-pop">
          <span class="value-strong">${escapeHtml(formatNumber(item.popularity || 0))}</span>
        </td>

        <td class="col-diff">
          ${rankTrendHtml(item)}
        </td>

        <td class="col-action">
          <button class="detail-btn" type="button" onclick='openRankingDetail(${safeJson(item)})'>
            상세보기
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

function bindRankingEvents(data) {
  const input = document.getElementById("rankingSearchInput");
  const resetButton = document.getElementById("rankingResetButton");
  const body = document.getElementById("rankingTableBody");

  if (!input || !body) return;

  const applySearch = () => {
    const keyword = String(input.value || "").trim().toLowerCase();
    const rows = Array.from(body.querySelectorAll("tr[data-character-row]"));

    rows.forEach((row) => {
      row.classList.remove("table-highlight");
      row.style.display = "";
    });

    if (!keyword) return;

    let firstMatch = null;

    rows.forEach((row) => {
      const name = row.getAttribute("data-character-row") || "";
      const matched = name.includes(keyword);

      if (!matched) {
        row.style.display = "none";
        return;
      }

      row.classList.add("table-highlight");
      if (!firstMatch) firstMatch = row;
    });

    if (firstMatch) {
      firstMatch.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  input.addEventListener("input", applySearch);

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      input.value = "";
      applySearch();
      input.focus();
    });
  }
}

function openRankingDetail(item) {
  const name = item?.name || "-";
  const guild = item?.guild || "길드 없음";
  const level = item?.level || "-";
  const power = item?.powerText || "-";
  const popularity = item?.popularity || 0;
  const serverRank = item?.serverRank || "-";
  const rankDiff = item?.weeklyRankDiffText || "-";
  const growth = item?.weeklyGrowthRateText || "-";

  alert(
    [
      `캐릭터명: ${name}`,
      `길드: ${guild}`,
      `서버 순위: ${serverRank}위`,
      `레벨: Lv ${level}`,
      `전투력: ${power}`,
      `인기도: ${formatNumber(popularity)}`,
      `주간 순위 변화: ${rankDiff}`,
      `주간 성장률: ${growth}`
    ].join("\n")
  );
}

function safeJson(value) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/'/g, "\\u0027");
}