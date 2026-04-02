document.addEventListener("DOMContentLoaded", async () => {
  renderShell();
  renderLoading("weekly-page", "주간 데이터를 불러오는 중...");

  try {
    const rows = await getWeeklyData();
    const root = document.getElementById("weekly-page");
    root.innerHTML = renderWeeklyPage(Array.isArray(rows) ? rows : []);
  } catch (error) {
    console.error(error);
    renderError("weekly-page", error);
  }
});

function renderWeeklyPage(rows) {
  const topRows = [...rows].sort((a, b) => Number(b.weeklyDiff || b.weekly_diff || 0) - Number(a.weeklyDiff || a.weekly_diff || 0)).slice(0, 10);

  return `
    <section class="page-card">
      <div class="section-head">
        <div>
          <h1 class="section-title">주간 성장</h1>
          <p class="section-sub">성장량 중심 카드형 목록</p>
        </div>
      </div>

      <div class="weekly-card-list">
        ${topRows.length ? topRows.map((item, index) => weeklyCard(item, index + 1)).join("") : createEmptyBox("주간 데이터가 없습니다.")}
      </div>
    </section>
  `;
}

function weeklyCard(item, rank) {
  const diff = item.weeklyDiff ?? item.weekly_diff ?? 0;
  return `
    <article class="weekly-card">
      <div class="weekly-card-left">
        <div class="rank-chip">${rank}</div>
        ${characterAvatarHtml(item)}
      </div>
      <div class="weekly-card-main">
        <div class="rank-name">${escapeHtml(item.name || "-")}</div>
        <div class="rank-subline">${guildBadgeHtml(item.guild || "길드 없음")} <span>${escapeHtml(item.job || "-")}</span></div>
        <div class="weekly-bottom-row">
          <div class="mini-stat"><span>성장량</span><strong>${metricHtml(diff)}</strong></div>
          <div class="mini-stat"><span>현재 전투력</span><strong>${escapeHtml(formatCompactPower(item.powerText || item.power_text || "-"))}</strong></div>
        </div>
      </div>
    </article>
  `;
}
