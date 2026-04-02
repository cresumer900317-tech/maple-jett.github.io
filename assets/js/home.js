document.addEventListener("DOMContentLoaded", async () => {
  renderShell();
  renderLoading("home-page", "홈 데이터를 불러오는 중...");

  try {
    const summary = await getHomeData();
    const members = await getGuildsData().catch(() => []);
    const root = document.getElementById("home-page");
    root.innerHTML = renderHomePage(summary, members);
  } catch (error) {
    console.error(error);
    renderError("home-page", error);
  }
});

function renderHomePage(summary, members) {
  const topMembers = Array.isArray(members) ? [...members].sort((a, b) => Number(b.power || 0) - Number(a.power || 0)).slice(0, 5) : [];
  const guildGroups = groupByGuild(members);

  return `
    <section class="hero-card">
      <div class="hero-copy">
        <div class="eyebrow">GUILD PORTAL</div>
        <h1 class="hero-title">친구패밀리</h1>
        <p class="hero-desc">친구들 · 친구둘 · 친구삼 · 친구넷 · 친구닷 길드원을 모바일에서도 보기 편하게 정리한 길드 포털</p>
      </div>
      <div class="kpi-grid">
        ${kpiCard("총 인원", formatNumber(summary.member_count || 0))}
        ${kpiCard("최고 전투력", escapeHtml(formatCompactPower(summary.top_power || "0")))}
        ${kpiCard("상위 멤버", escapeHtml(summary.top_member || "-"))}
        ${kpiCard("주간 성장 1위", escapeHtml(summary.top_growth_name || "-"))}
      </div>
    </section>

    <section class="section-block">
      <div class="section-head">
        <div>
          <h2 class="section-title">전투력 TOP 5</h2>
          <p class="section-sub">가장 강한 길드원</p>
        </div>
        <a class="section-link" href="./ranking.html">전체 보기</a>
      </div>
      <div class="top-stack">
        ${topMembers.length ? topMembers.map((item, index) => topMemberCard(item, index + 1)).join("") : createEmptyBox("데이터가 없습니다.")}
      </div>
    </section>

    <section class="section-block">
      <div class="section-head">
        <div>
          <h2 class="section-title">길드별 요약</h2>
          <p class="section-sub">길드별 인원과 상위 멤버</p>
        </div>
      </div>
      <div class="guild-summary-grid">
        ${Object.entries(guildGroups).map(([guild, rows]) => guildSummaryCard(guild, rows)).join("")}
      </div>
    </section>
  `;
}

function kpiCard(label, value) {
  return `
    <article class="kpi-card">
      <div class="kpi-label">${label}</div>
      <div class="kpi-value">${value}</div>
    </article>
  `;
}

function topMemberCard(item, rank) {
  return `
    <article class="top-member-card">
      <div class="top-rank-badge">${rank}</div>
      ${characterAvatarHtml(item)}
      <div class="top-member-main">
        <div class="top-member-name">${escapeHtml(item.name || "-")}</div>
        <div class="top-member-sub">${guildBadgeHtml(item.guild || "길드 없음")} <span>Lv ${escapeHtml(item.level || "-")}</span></div>
      </div>
      <div class="top-member-power">${escapeHtml(formatCompactPower(item.powerText || "-"))}</div>
    </article>
  `;
}

function groupByGuild(rows) {
  const grouped = {};
  (Array.isArray(rows) ? rows : []).forEach((row) => {
    const guild = normalizeGuildName(row.guild || "길드 없음");
    grouped[guild] ||= [];
    grouped[guild].push(row);
  });
  return grouped;
}

function guildSummaryCard(guild, rows) {
  const sorted = [...rows].sort((a, b) => Number(b.power || 0) - Number(a.power || 0));
  const best = sorted[0];
  return `
    <article class="guild-summary-card">
      <div class="guild-summary-top">
        ${guildBadgeHtml(guild)}
        <span class="guild-summary-count">${formatNumber(rows.length)}명</span>
      </div>
      <div class="guild-summary-body">
        <div class="guild-summary-name">${escapeHtml(best?.name || "-")}</div>
        <div class="guild-summary-meta">최고 전투력 · ${escapeHtml(formatCompactPower(best?.powerText || "-"))}</div>
      </div>
    </article>
  `;
}
