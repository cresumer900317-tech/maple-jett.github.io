document.addEventListener("DOMContentLoaded", async () => {
  const data = await getHomeData();
  setText(
    "weeklyMetaText",
    `주간 기준: ${formatDateTime(data.meta.weeklyBaseAt)} · 범위: ${data.meta.weekRange || "-"}`
  );

  renderWeeklyCards(data.weeklyTop.power || [], "power");

  const tabs = document.getElementById("weeklyTabs");
  tabs?.addEventListener("click", (event) => {
    const button = event.target.closest(".tab-btn");
    if (!button) return;

    tabs.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("is-active"));
    button.classList.add("is-active");

    const tab = button.dataset.tab;
    renderWeeklyCards(data.weeklyTop[tab] || [], tab);
  });

  renderFooter();
});

function renderWeeklyCards(rows, tab) {
  const root = document.getElementById("weeklyTopGrid");
  if (!root) return;

  if (!rows.length) {
    root.innerHTML = `<div class="empty-state">주간 TOP 데이터가 없습니다.</div>`;
    return;
  }

  root.innerHTML = rows.slice(0, 3).map((row, index) => {
    const medalClass =
      index === 0 ? "is-gold" :
      index === 1 ? "is-silver" :
      "is-bronze";

    const medalText = index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉";

    const title =
      tab === "power"
        ? row.diffText || "0"
        : row.diffText || formatSignedNumber(row.diff);

    const extra =
      tab === "power"
        ? `${row.powerText || "-"} · ${row.growthRateText || "0%"}`
        : tab === "level"
          ? `현재 레벨 ${formatNumber(row.currentLevel)}`
          : `현재 인기도 ${formatNumber(row.currentPopularity)}`;

    return `
      <article class="weekly-card">
        <div class="weekly-card-rank ${medalClass}">${medalText}</div>
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

function renderFooter() {
  const footer = document.getElementById("footerApiText");
  if (!footer) return;
  footer.textContent = appState.source === "api"
    ? "실시간 연동: Apps Script API 사용 중"
    : "API 실패 시 fallback 데이터 사용 중";
}