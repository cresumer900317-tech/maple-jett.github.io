document.addEventListener("DOMContentLoaded", async () => {
  renderShell();
  renderLoading("home-page", "홈 데이터를 불러오는 중...");

  try {
    const [homeData, noticeData] = await Promise.all([
      getHomeData(),
      getNoticeData().catch(() => ({ posts: [] }))
    ]);
    const root = document.getElementById("home-page");
    root.innerHTML = renderHome(homeData, noticeData.posts || []);
  } catch (error) {
    console.error(error);
    renderError("home-page", error);
  }
});

function renderHome(data, noticePosts) {
  const meta = data?.meta || {};
  const summary = data?.summary || {};
  const guilds = Array.isArray(data?.guilds) ? data.guilds : [];
  const topPower = Array.isArray(data?.weeklyTop?.power) ? data.weeklyTop.power.slice(0, 5) : [];

  return `
    <div class="page-grid">
      <div class="home-top">
        <section class="panel hero-panel">
          <h1 class="hero-title">친구패밀리</h1>
          <p class="hero-desc">친구들 · 친구둘 · 친구삼 · 친구넷 · 친구닷의 랭킹, 성장, 공지 데이터를 한곳에서 확인하는 길드 포털</p>
          <div class="hero-meta-grid">
            <div class="meta-card">
              <div class="meta-label">마지막 갱신</div>
              <div class="meta-value">${escapeHtml(formatDateTime(meta.latestSnapshotAt))}</div>
            </div>
            <div class="meta-card">
              <div class="meta-label">주간 기준</div>
              <div class="meta-value">${escapeHtml(formatDateTime(meta.weeklyBaseAt))}</div>
            </div>
            <div class="meta-card">
              <div class="meta-label">주간 범위</div>
              <div class="meta-value">${escapeHtml(meta.weekRange || "-")}</div>
            </div>
          </div>
        </section>

        <section class="panel summary-panel">
          <div class="panel-head">
            <div>
              <h2 class="panel-title">운영 현황</h2>
              <p class="panel-subtitle">현재 API 기준 요약</p>
            </div>
            <span class="live-badge">LIVE</span>
          </div>
          <div class="summary-grid">
            <div class="stat-card"><div class="stat-label">총 인원</div><div class="stat-value">${escapeHtml(formatNumber(summary.memberCount || 0))}</div></div>
            <div class="stat-card"><div class="stat-label">평균 레벨</div><div class="stat-value">${escapeHtml(formatDecimal(summary.avgLevel || 0, 2))}</div></div>
            <div class="stat-card"><div class="stat-label">평균 전투력</div><div class="stat-value">${escapeHtml(formatCompactPower(summary.avgPowerText || "0"))}</div></div>
            <div class="stat-card"><div class="stat-label">평균 인기도</div><div class="stat-value">${escapeHtml(formatDecimal(summary.avgPopularity || 0, 2))}</div></div>
          </div>
        </section>
      </div>

      <div class="home-middle">
        <section class="panel section-panel">
          <div class="panel-head">
            <div>
              <h2 class="panel-title">최근 공지</h2>
              <p class="panel-subtitle">상위 3개 공지 미리보기</p>
            </div>
            <a class="section-link" href="./notice.html">전체 보기</a>
          </div>
          ${renderBoardList(noticePosts.slice(0, 3), "공지 데이터가 없습니다.")}
        </section>

        <section class="panel section-panel">
          <div class="panel-head">
            <div>
              <h2 class="panel-title">주간 전투력 TOP</h2>
              <p class="panel-subtitle">이번 주 전투력 상승 상위 5명</p>
            </div>
            <a class="section-link" href="./weekly.html">전체 보기</a>
          </div>
          ${renderTopPower(topPower)}
        </section>
      </div>

      <section class="panel guild-panel">
        <div class="panel-head">
          <div>
            <h2 class="panel-title">길드별 요약</h2>
            <p class="panel-subtitle">길드별 평균 레벨, 전투력, 주간 변화</p>
          </div>
          <a class="section-link" href="./members.html">상세 보기</a>
        </div>
        ${renderGuildTable(guilds)}
      </section>
    </div>
  `;
}

function renderTopPower(rows) {
  if (!rows.length) return createEmptyBox("주간 성장 데이터가 없습니다.");
  return `
    <div class="top-list">
      ${rows.map((item, index) => `
        <div class="top-item">
          <div class="top-rank">${index + 1}</div>
          <div>
            <div class="top-name">${escapeHtml(item.name || "-")}</div>
            <div class="top-sub">
              ${guildBadgeHtml(item.guild || "길드 없음")}
              <span>Lv ${escapeHtml(formatNumber(item.level || 0))}</span>
              <span>${escapeHtml(formatCompactPower(item.powerText || "-"))}</span>
            </div>
          </div>
          <div class="top-value">${metricHtml(item.diffText || "0")}</div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderGuildTable(rows) {
  if (!rows.length) return createEmptyBox("길드 요약 데이터가 없습니다.");
  return `
    <div class="table-wrap">
      <table class="table">
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
          ${rows.map((row) => `
            <tr>
              <td>${guildBadgeHtml(row.guild || "길드 없음")}</td>
              <td class="col-center">${escapeHtml(formatNumber(row.memberCount || 0))}</td>
              <td class="col-center">${escapeHtml(formatDecimal(row.avgLevel || 0, 2))}</td>
              <td class="col-center" title="${escapeHtml(row.avgPowerText || "-")}">${escapeHtml(formatCompactPower(row.avgPowerText || "-"))}</td>
              <td class="col-center">${escapeHtml(formatDecimal(row.avgPopularity || 0, 2))}</td>
              <td class="col-center">${metricHtml(row.weeklyPowerDiffText || "0")}</td>
              <td class="col-center">${escapeHtml(formatNumber(row.weeklyLevelUpCount || 0))}</td>
              <td class="col-center">${escapeHtml(formatNumber(row.weeklyPopularityDiffSum || 0))}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}
