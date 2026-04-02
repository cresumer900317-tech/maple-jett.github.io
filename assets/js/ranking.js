document.addEventListener("DOMContentLoaded", async () => {
  renderShell();
  renderLoading("ranking-page", "랭킹 데이터를 불러오는 중...");

  try {
    const rows = await getRankingData();
    const root = document.getElementById("ranking-page");
    root.innerHTML = renderRankingPage(Array.isArray(rows) ? rows : []);
    bindRankingEvents(rows);
  } catch (error) {
    console.error(error);
    renderError("ranking-page", error);
  }
});

function renderRankingPage(rows) {
  return `
    <section class="page-card">
      <div class="section-head">
        <div>
          <h1 class="section-title">길드 통합 랭킹</h1>
          <p class="section-sub">모바일 우선 카드형 UI</p>
        </div>
      </div>

      <div class="toolbar-card">
        <label class="search-field">
          <span>🔎</span>
          <input id="rankingSearchInput" type="text" placeholder="캐릭터명 검색" autocomplete="off" />
        </label>
        <button id="rankingResetButton" class="ghost-btn" type="button">초기화</button>
      </div>

      <div id="rankingCardList" class="rank-card-list">
        ${rows.length ? rows.map((item, index) => rankingCard(item, index + 1)).join("") : createEmptyBox("랭킹 데이터가 없습니다.")}
      </div>
    </section>
  `;
}

function rankingCard(item, displayRank) {
  return `
    <article class="rank-card" data-character-row="${escapeHtml(String(item.name || "").toLowerCase())}">
      <div class="rank-card-left">
        <div class="rank-chip">${displayRank}</div>
        ${characterAvatarHtml(item)}
      </div>

      <div class="rank-card-main">
        <div class="rank-card-top">
          <div>
            <div class="rank-name">${escapeHtml(item.name || "-")}</div>
            <div class="rank-subline">${guildBadgeHtml(item.guild || "길드 없음")} <span>Lv ${escapeHtml(item.level || "-")}</span></div>
          </div>
          <div class="rank-power">${escapeHtml(formatCompactPower(item.powerText || item.power_text || "-"))}</div>
        </div>

        <div class="rank-meta-grid">
          <div class="mini-stat"><span>서버 순위</span><strong>${escapeHtml(item.serverRank || displayRank)}</strong></div>
          <div class="mini-stat"><span>전투력</span><strong>${escapeHtml(fullPowerText(item.powerText || item.power_text || "-"))}</strong></div>
          <div class="mini-stat"><span>주간 변화</span><strong>${rankTrendHtml(item)}</strong></div>
        </div>
      </div>
    </article>
  `;
}

function bindRankingEvents(data) {
  const input = document.getElementById("rankingSearchInput");
  const resetButton = document.getElementById("rankingResetButton");
  const wrap = document.getElementById("rankingCardList");
  if (!input || !wrap) return;

  const applySearch = () => {
    const keyword = String(input.value || "").trim().toLowerCase();
    const rows = Array.from(wrap.querySelectorAll("[data-character-row]"));

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

    if (firstMatch) firstMatch.scrollIntoView({ behavior: "smooth", block: "center" });
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
