document.addEventListener("DOMContentLoaded", async () => {
  renderShell();
  renderLoading("home-page", "홈 데이터를 불러오는 중...");

  try {
    const summary = await getHomeData();
    const members = await getGuildsData();
    const rows = Array.isArray(members) ? members : [];
    const grouped = byGuild(rows);
    const guilds = ["친구들", "친구둘", "친구삼", "친구넷", "친구닷"];
    const activeServerRanks = rows.filter(x => Number(x.serverRank || 0) > 0).map(x => Number(x.serverRank));
    const avgServerRank = activeServerRanks.length ? (activeServerRanks.reduce((a, b) => a + b, 0) / activeServerRanks.length).toFixed(1) : "-";
    const avgPower = rows.length ? Math.round(rows.reduce((sum, row) => sum + Number(row.power || 0), 0) / rows.length) : 0;
    const growthTop = [...rows].sort((a, b) => Number(b.weeklyDiff || 0) - Number(a.weeklyDiff || 0)).slice(0, 5);
    const riseTop = [...rows].sort((a, b) => Number(b.serverRankDiff || 0) - Number(a.serverRankDiff || 0)).filter(x => Number(x.serverRankDiff || 0) > 0).slice(0, 5);

    document.getElementById("home-page").innerHTML = `
      <section class="hero-card home-hero">
        <div class="hero-copy">
          <div class="eyebrow">함께해서 즐거운</div>
          <h1 class="hero-title">친구패밀리</h1>
          <p class="hero-desc">길드 현황, 통합 랭킹, 주간 성장, 서버 순위 변화를 한 화면에서 관리하는 패밀리 대시보드</p>
        </div>
        <div class="hero-actions">
          <a class="cta-btn" href="https://open.kakao.com/o/gagOlyni" target="_blank" rel="noopener noreferrer">가입 문의</a>
        </div>
        <div class="kpi-grid">
          <article class="kpi-card"><div class="kpi-label">총 길드 수</div><div class="kpi-value">${formatNumber(summary.guild_count || 5)}</div></article>
          <article class="kpi-card"><div class="kpi-label">총 인원</div><div class="kpi-value">${formatNumber(summary.member_count || rows.length)}</div></article>
          <article class="kpi-card"><div class="kpi-label">평균 전투력</div><div class="kpi-value">${formatNumber(avgPower)}</div></article>
          <article class="kpi-card"><div class="kpi-label">평균 서버 순위</div><div class="kpi-value">${avgServerRank}</div></article>
        </div>
      </section>

      <section class="section-block">
        <div class="section-head">
          <div>
            <h2 class="section-title">패밀리 리더보드</h2>
            <p class="section-sub">길드별 전투력 TOP 10 · 각 카드 내부 스크롤</p>
          </div>
        </div>
        <div class="family-board-grid">
          ${guilds.map((guild) => {
            const list = [...(grouped[guild] || [])].sort((a, b) => Number(b.power || 0) - Number(a.power || 0)).slice(0, 10);
            const avg = list.length ? Math.round(list.reduce((s, row) => s + Number(row.power || 0), 0) / list.length) : 0;
            return `
              <article class="guild-board-card">
                <div class="guild-board-head">
                  ${guildBadgeHtml(guild)}
                  <span class="guild-board-meta">${formatNumber((grouped[guild] || []).length)}명 · 평균 ${formatNumber(avg)}</span>
                </div>
                <div class="scroll-panel guild-scroll">
                  <div class="tight-list">
                    ${list.length ? list.map((item) => `
                      <div class="tight-row">
                        <span class="tight-rank">${item.guildRank || "-"}</span>
                        <span class="tight-name">${escapeHtml(item.name || "-")}</span>
                        <span class="tight-power">${escapeHtml(formatCompactPower(item.powerText || "-"))}</span>
                      </div>
                    `).join("") : createEmptyBox("인원 없음")}
                  </div>
                </div>
              </article>
            `;
          }).join("")}
        </div>
      </section>

      <section class="section-block">
        <div class="section-head">
          <div>
            <h2 class="section-title">이번 주 변화</h2>
            <p class="section-sub">상승 폭과 서버 순위 상승을 요약</p>
          </div>
        </div>
        <div class="summary-split">
          <div class="scroll-panel summary-panel">
            <div class="sub-head">성장 TOP 5</div>
            <div class="mini-card-list">
              ${growthTop.length ? growthTop.map((item) => `
                <article class="mini-summary-card">
                  ${characterAvatarHtml(item)}
                  <div class="mini-summary-main">
                    <div class="mini-summary-name">${escapeHtml(item.name || "-")}</div>
                    <div class="mini-summary-sub">${guildBadgeHtml(item.guild)} · 성장률 ${escapeHtml(formatRate(item.growthRate || 0))}</div>
                  </div>
                  <div class="mini-summary-side">${metricHtml(item.weeklyDiff || 0)}</div>
                </article>
              `).join("") : createEmptyBox("첫 실행은 변화값이 0일 수 있습니다.")}
            </div>
          </div>
          <div class="scroll-panel summary-panel">
            <div class="sub-head">서버 순위 상승 TOP 5</div>
            <div class="mini-card-list">
              ${riseTop.length ? riseTop.map((item) => `
                <article class="mini-summary-card">
                  ${characterAvatarHtml(item)}
                  <div class="mini-summary-main">
                    <div class="mini-summary-name">${escapeHtml(item.name || "-")}</div>
                    <div class="mini-summary-sub">${guildBadgeHtml(item.guild)} · 현재 ${item.serverRank ? `${escapeHtml(formatNumber(item.serverRank))}위` : "-"}</div>
                  </div>
                  <div class="mini-summary-side">${rankTrendHtml(item)}</div>
                </article>
              `).join("") : createEmptyBox("서버 순위 데이터 수집 후 표시됩니다.")}
            </div>
          </div>
        </div>
      </section>
    `;
  } catch (error) {
    console.error(error);
    renderError("home-page", error);
  }
});
