document.addEventListener("DOMContentLoaded", async () => {
  renderShell();
  renderLoading("weekly-page", "주간 데이터를 불러오는 중...");
  try {
    const rows = await getWeeklyData();
    const list = Array.isArray(rows) ? rows : [];
    document.getElementById("weekly-page").innerHTML = `
      <section class="page-card">
        <div class="section-head"><div><h1 class="section-title">주간 성장</h1><p class="section-sub">성장량 / 성장률 / 서버 순위 상승 기준 전환</p></div></div>
        <div class="tab-bar">
          <button class="tab-btn is-active" data-weekly-sort="growthAbs" type="button">성장량</button>
          <button class="tab-btn" data-weekly-sort="growthRate" type="button">성장률</button>
          <button class="tab-btn" data-weekly-sort="serverRise" type="button">서버 상승</button>
        </div>
        <div id="weeklyScrollPanel" class="scroll-panel weekly-scroll"><div id="weeklyCardList" class="stack-list">
          ${list.length ? list.map((item) => `
            <article class="list-card" data-growth-abs="${Number(item.weeklyDiff || 0)}" data-growth-rate="${Number(item.growthRate || 0)}" data-server-rise="${Number(item.serverRankDiff || 0)}">
              <div class="card-left"><div class="rank-chip">${escapeHtml(item.rank || "-")}</div>${characterAvatarHtml(item)}</div>
              <div class="card-main">
                <div class="card-topline">
                  <div><div class="rank-name">${escapeHtml(item.name || "-")}</div><div class="rank-subline">${guildBadgeHtml(item.guild || "길드 없음")}<span>${escapeHtml(item.job || "-")}</span><span>Lv ${escapeHtml(item.level || "-")}</span></div></div>
                  <div class="rank-power">${escapeHtml(formatCompactPower(item.powerText || "-"))}</div>
                </div>
                <div class="meta-grid four">
                  <div class="mini-stat"><span>성장량</span><strong>${metricHtml(item.weeklyDiff || 0)}</strong></div>
                  <div class="mini-stat"><span>성장률</span><strong>${escapeHtml(formatRate(item.growthRate || 0))}</strong></div>
                  <div class="mini-stat"><span>서버 변동</span><strong>${rankTrendHtml(item)}</strong></div>
                  <div class="mini-stat"><span>현재 서버 순위</span><strong>${item.serverRank ? `${escapeHtml(formatNumber(item.serverRank))}위` : "-"}</strong></div>
                </div>
              </div>
            </article>
          `).join("") : createEmptyBox("주간 데이터가 없습니다.")}
        </div></div>
      </section>`;

    const buttons = Array.from(document.querySelectorAll("[data-weekly-sort]"));
    const listWrap = document.getElementById("weeklyCardList");
    const sortMap = { growthAbs: "growth-abs", growthRate: "growth-rate", serverRise: "server-rise" };
    const apply = (mode) => {
      const key = sortMap[mode];
      const cards = Array.from(listWrap.children);
      cards.sort((a, b) => Number(b.getAttribute(`data-${key}`) || 0) - Number(a.getAttribute(`data-${key}`) || 0));
      cards.forEach((card) => listWrap.appendChild(card));
      buttons.forEach((btn) => btn.classList.toggle("is-active", btn.getAttribute("data-weekly-sort") === mode));
    };
    buttons.forEach((btn) => btn.addEventListener("click", () => apply(btn.getAttribute("data-weekly-sort"))));
    apply("growthAbs");
  } catch (error) {
    console.error(error);
    renderError("weekly-page", error);
  }
});
