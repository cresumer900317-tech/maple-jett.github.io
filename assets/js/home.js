document.addEventListener("DOMContentLoaded", async () => {
  renderShell();
  renderLoading("home-page", "홈 데이터를 불러오는 중...");

  try {
    const data = await loadHomeSummary();
    const root = document.getElementById("home-page");
    if (!root) return;
    root.innerHTML = renderHomeSummary(data);
  } catch (error) {
    console.error(error);
    renderError("home-page", error);
  }
});

async function loadHomeSummary() {
  const response = await fetch("./data/home-summary.json?v=2", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`home-summary.json 로드 실패: ${response.status}`);
  }
  return response.json();
}

function renderHomeSummary(data) {
  const guildName = data?.guild_name || "친구패밀리";
  const memberCount = Number(data?.member_count || 0);
  const topMember = data?.top_member || "-";
  const topPower = Number(data?.top_power || 0);
  const topGrowthName = data?.top_growth_name || "-";
  const topGrowthValue = Number(data?.top_growth_value || 0);

  return `
    <div class="page-grid">
      <div class="home-top">
        <section class="panel hero-panel">
          <h1 class="hero-title">${escapeHtml(guildName)}</h1>
          <p class="hero-desc">Python이 생성한 경량 JSON만 읽는 홈 화면입니다. 첫 진입 속도를 우선으로 구성했습니다.</p>
          <div class="hero-meta-grid">
            <div class="meta-card">
              <div class="meta-label">길드명</div>
              <div class="meta-value">${escapeHtml(guildName)}</div>
            </div>
            <div class="meta-card">
              <div class="meta-label">총 인원</div>
              <div class="meta-value">${escapeHtml(formatNumber(memberCount))}</div>
            </div>
            <div class="meta-card">
              <div class="meta-label">데이터 소스</div>
              <div class="meta-value">Local JSON</div>
            </div>
          </div>
        </section>

        <section class="panel summary-panel">
          <div class="panel-head">
            <div>
              <h2 class="panel-title">핵심 요약</h2>
              <p class="panel-subtitle">첫 화면에서 꼭 필요한 값만 표시</p>
            </div>
            <span class="live-badge">FAST</span>
          </div>
          <div class="summary-grid">
            <div class="stat-card">
              <div class="stat-label">최고 전투력</div>
              <div class="stat-value">${escapeHtml(topMember)}</div>
              <div class="stat-sub">${escapeHtml(formatNumber(topPower))}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">주간 성장 1위</div>
              <div class="stat-value">${escapeHtml(topGrowthName)}</div>
              <div class="stat-sub">+${escapeHtml(formatNumber(topGrowthValue))}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">멤버 페이지</div>
              <div class="stat-value"><a class="section-link" href="./members.html">이동</a></div>
            </div>
            <div class="stat-card">
              <div class="stat-label">랭킹 페이지</div>
              <div class="stat-value"><a class="section-link" href="./ranking.html">이동</a></div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `;
}
