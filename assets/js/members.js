document.addEventListener("DOMContentLoaded", async () => {
  renderShell();
  renderLoading("members-page", "길드원 데이터를 불러오는 중...");

  try {
    const rows = await getGuildsData();
    const root = document.getElementById("members-page");
    root.innerHTML = renderMembersPage(Array.isArray(rows) ? rows : []);
  } catch (error) {
    console.error(error);
    renderError("members-page", error);
  }
});

function renderMembersPage(rows) {
  const guildGroups = {};
  rows.forEach((row) => {
    const guild = normalizeGuildName(row.guild || "길드 없음");
    guildGroups[guild] ||= [];
    guildGroups[guild].push(row);
  });

  return `
    <section class="page-card">
      <div class="section-head">
        <div>
          <h1 class="section-title">길드원 목록</h1>
          <p class="section-sub">길드별 카드 정리</p>
        </div>
      </div>

      <div class="guild-member-group-list">
        ${Object.entries(guildGroups).map(([guild, list]) => renderGuildMemberGroup(guild, list)).join("")}
      </div>
    </section>
  `;
}

function renderGuildMemberGroup(guild, rows) {
  const sorted = [...rows].sort((a, b) => Number(b.power || 0) - Number(a.power || 0));
  return `
    <section class="guild-group-card">
      <div class="guild-group-head">
        ${guildBadgeHtml(guild)}
        <span class="guild-group-count">${formatNumber(sorted.length)}명</span>
      </div>
      <div class="member-card-list">
        ${sorted.map((item, index) => memberCard(item, index + 1)).join("")}
      </div>
    </section>
  `;
}

function memberCard(item, rank) {
  return `
    <article class="member-card">
      <div class="member-card-left">
        <div class="small-rank-chip">${rank}</div>
        ${characterAvatarHtml(item)}
      </div>
      <div class="member-card-main">
        <div class="member-name">${escapeHtml(item.name || "-")}</div>
        <div class="member-subline"><span>${escapeHtml(item.job || "-")}</span><span>Lv ${escapeHtml(item.level || "-")}</span></div>
        <div class="member-meta-grid">
          <div class="mini-stat"><span>전투력</span><strong>${escapeHtml(formatCompactPower(item.powerText || "-"))}</strong></div>
          <div class="mini-stat"><span>서버 순위</span><strong>${item.serverRank ? escapeHtml(formatNumber(item.serverRank)) + "위" : "-"}</strong></div>
        </div>
      </div>
    </article>
  `;
}
