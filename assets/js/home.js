document.addEventListener("DOMContentLoaded", async () => {
  renderShell();

  const homeRoot = document.getElementById("home-page");
  if (!homeRoot) return;

  renderLoading("home-page", "홈 데이터를 불러오는 중...");

  try {
    const [homeData, noticeData] = await Promise.all([
      getHomeData(),
      getNoticeData().catch(() => ({ posts: [] }))
    ]);

    homeRoot.innerHTML = renderHomePage(homeData, noticeData.posts || []);
  } catch (error) {
    console.error(error);
    renderError("home-page", error);
  }
});

function renderHomePage(data, noticePosts) {
  const meta = data?.meta || {};
  const summary = data?.summary || {};
  const guilds = Array.isArray(data?.guilds) ? data.guilds : [];
  const weeklyTopPower = Array.isArray(data?.weeklyTop?.power) ? data.weeklyTop.power.slice(0, 5) : [];

  return `
    <div class="home-top-grid">
      <section class="hero-panel">
        <h1 class="page-title">친구패밀리</h1>
        <p class="page-desc">친구들 · 친구둘 · 친구삼 · 친구넷 · 친구닷의 랭킹, 성장, 공지 데이터를 한곳에서 확인하는 길드 포털</p>

        <div class="hero-meta-grid">
          <div class="meta-chip">
            <div class="meta-chip-label">마지막 갱신</div>
            <div class="meta-chip-value">${escapeHtml(formatDateTime(meta.latestSnapshotAt))}</div>
          </div>
          <div class="meta-chip">
            <div class="meta-chip-label">주간 기준</div>
            <div class="meta-chip-value">${escapeHtml(formatDateTime(meta.weeklyBaseAt))}</div>
          </div>
          <div class="meta-chip">
            <div class="meta-chip-label">주간 범위</div>
            <div class="meta-chip-value">${escapeHtml(meta.weekRange || "-")}</div>
          </div>
        </div>
      </section>

      <section class="summary-panel">
        <div class="section-header">
          <div>
            <h2 class="section-title">운영 현황</h2>
          </div>
          <span class="live-badge">LIVE</span>
        </div>

        <div class="summary-stat-grid">
          <div class="summary-stat-card">
            <div class="summary-stat-label">총 인원</div>
            <div class="summary-stat-value">${escapeHtml(formatNumber(summary.memberCount || 0))}</div>
          </div>
          <div class="summary-stat-card">
            <div class="summary-stat-label">평균 레벨</div>
            <div class="summary-stat-value">${escapeHtml(formatDecimal(summary.avgLevel || 0, 2))}</div>
          </div>
          <div class="summary-stat-card">
            <div class="summary-stat-label">평균 전투력</div>
            <div class="summary-stat-value">${escapeHtml(compactPowerText(summary.avgPowerText || "0"))}</div>
          </div>
          <div class="summary-stat-card">
            <div class="summary-stat-label">평균 인기도</div>
            <div class="summary-stat-value">${escapeHtml(formatDecimal(summary.avgPopularity || 0, 2))}</div>
          </div>
        </div>
      </section>
    </div>

    <div class="home-mid-grid">
      <section class="board-panel">
        <div class="section-header">
          <div>
            <h2 class="section-title">최근 공지</h2>
          </div>
          <a class="section-link" href="./notice.html">전체 보기</a>
        </div>
        ${renderNoticeList(noticePosts, { limit: 3 })}
      </section>

      <section class="table-panel">
        <div class="section-header">
          <div>
            <h2 class="section-title">주간 전투력 TOP</h2>
            <p class="section-subtitle">이번 주 상승폭이 큰 캐릭터</p>
          </div>
          <a class="section-link" href="./weekly.html">전체 보기</a>
        </div>
        ${renderWeeklyTopList(weeklyTopPower)}
      </section>
    </div>

    <section class="home-guild-panel section-card">
      <div class="section-header">
        <div>
          <h2 class="section-title">길드별 요약</h2>
          <p class="section-subtitle">길드별 평균 레벨, 평균 전투력, 성장 현황</p>
        </div>
        <a class="section-link" href="./members.html">상세 보기</a>
      </div>
      ${renderGuildSummaryTable(guilds)}
    </section>
  `;
}

function renderWeeklyTopList(rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return createEmptyBox("주간 성장 데이터가 없습니다.");
  }

  return `
    <div class="top-list">
      ${rows.map((item, index) => `
        <div class="top-item">
          <div class="top-rank">${index + 1}</div>
          <div class="top-main">
            <div class="top-name">${escapeHtml(item.name || "-")}</div>
            <div class="top-sub">
              ${guildBadgeHtml(item.guild || "길드 없음")}
              <span>Lv ${escapeHtml(formatNumber(item.level || 0))}</span>
              <span>${escapeHtml(compactPowerText(item.powerText || "-"))}</span>
            </div>
          </div>
          <div class="top-value">${signedTextHtml(item.diffText || "0")}</div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderGuildSummaryTable(rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return createEmptyBox("길드 요약 데이터가 없습니다.");
  }

  return `
    <div class="guild-summary-table-wrap">
      <table class="guild-summary-table">
        <thead>
          <tr>
            <th>길드</th>
            <th>인원</th>
            <th>평균 레벨</th>
            <th>평균 전투력</th>
            <th>평균 인기도</th>
            <th>주간 전투력 증감</th>
            <th>주간 레벨업</th>
            <th>주간 인기도 증감</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => {
            const guild = normalizeGuildName(row.guild);
            return `
              <tr>
                <td class="guild-cell">
                  <div class="guild-name-block">
                    <span class="guild-line ${GUILD_META[guild].className}"></span>
                    <div class="guild-name-text">${escapeHtml(guild)}</div>
                  </div>
                </td>
                <td>${escapeHtml(formatNumber(row.memberCount || 0))}</td>
                <td>${escapeHtml(formatDecimal(row.avgLevel || 0, 2))}</td>
                <td title="${escapeHtml(fullPowerText(row.avgPowerText || "0"))}">${escapeHtml(compactPowerText(row.avgPowerText || "0"))}</td>
                <td>${escapeHtml(formatDecimal(row.avgPopularity || 0, 2))}</td>
                <td>${signedTextHtml(row.weeklyPowerDiffText || "0")}</td>
                <td>${escapeHtml(formatNumber(row.weeklyLevelUpCount || 0))}</td>
                <td>${escapeHtml(formatNumber(row.weeklyPopularityDiffSum || 0))}</td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}