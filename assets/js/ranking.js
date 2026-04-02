document.addEventListener("DOMContentLoaded", async () => {
  renderShell();

  const root = document.getElementById("ranking-page");
  if (!root) return;

  renderLoading("ranking-page", "랭킹 데이터를 불러오는 중...");

  try {
    const rows = await loadRankingRows();
    root.innerHTML = renderRankingPage(rows);
    bindRankingEvents();
  } catch (error) {
    console.error(error);
    renderError("ranking-page", error);
  }
});

async function loadRankingRows() {
  const response = await fetch("./data/ranking.json?v=2", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`ranking.json 로드 실패: ${response.status}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

function renderRankingPage(rows) {
  return `
    <section class="section-card">
      <div class="section-header">
        <div>
          <h1 class="section-title">서버 순위표</h1>
          <p class="section-subtitle">Python이 생성한 ranking.json 기준 정렬</p>
        </div>
      </div>

      <div class="table-toolbar">
        <div class="value-soft">총 ${escapeHtml(formatNumber(rows.length))}명</div>

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
              <th class="col-power">전투력</th>
              <th class="col-diff">주간 변화</th>
            </tr>
          </thead>
          <tbody id="rankingTableBody">
            ${renderRankingRows(rows)}
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
        <td colspan="5">${createEmptyBox("랭킹 데이터가 없습니다.")}</td>
      </tr>
    `;
  }

  return rows.map((item, index) => {
    const rank = Number(item.rank || index + 1);
    const medalClass =
      index === 0 ? "top1" :
      index === 1 ? "top2" :
      index === 2 ? "top3" : "normal";

    return `
      <tr data-character-row="${escapeHtml(String(item.name || "").toLowerCase())}">
        <td class="col-rank"><span class="rank-medal ${medalClass}">${escapeHtml(String(rank))}</span></td>
        <td class="col-character">
          <div class="character-cell">
            <div class="character-avatar-wrap">
              <img
                class="character-avatar"
                src="${escapeHtml(item.image || "")}" 
                alt="${escapeHtml(item.name || "캐릭터 이미지")}" 
                loading="lazy"
                decoding="async"
                referrerpolicy="no-referrer"
                onerror="this.style.display='none'"
              />
            </div>
            <div class="character-main">
              <div class="character-name-row">
                <span class="character-name">${escapeHtml(item.name || "-")}</span>
              </div>
              <div class="character-sub">
                <span>${escapeHtml(item.job || "-")}</span>
              </div>
            </div>
          </div>
        </td>
        <td class="col-guild">${guildBadgeHtml(item.guild || "길드 없음")}</td>
        <td class="col-power"><span class="value-strong">${escapeHtml(formatNumber(item.power || 0))}</span></td>
        <td class="col-diff"><span class="value-strong">+${escapeHtml(formatNumber(item.weekly_diff || 0))}</span></td>
      </tr>
    `;
  }).join("");
}

function bindRankingEvents() {
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
