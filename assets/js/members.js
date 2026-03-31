document.addEventListener("DOMContentLoaded", async () => {
  const data = await getHomeData();
  const state = {
    members: data.members || [],
    search: "",
    guild: "ALL",
    sort: "power"
  };

  setupGuildOptions(data.guilds || []);
  renderMembers(state);

  document.getElementById("memberSearchInput")?.addEventListener("input", (e) => {
    state.search = String(e.target.value || "").trim().toLowerCase();
    renderMembers(state);
  });

  document.getElementById("guildFilterSelect")?.addEventListener("change", (e) => {
    state.guild = e.target.value;
    renderMembers(state);
  });

  document.getElementById("sortSelect")?.addEventListener("change", (e) => {
    state.sort = e.target.value;
    renderMembers(state);
  });

  renderFooter();
});

function setupGuildOptions(guilds) {
  const select = document.getElementById("guildFilterSelect");
  if (!select) return;

  const items = ["ALL", ...new Set(guilds.map((g) => g.guild).filter(Boolean))];
  select.innerHTML = items.map((item) => `
    <option value="${escapeHtml(item)}">${escapeHtml(item === "ALL" ? "전체 길드" : item)}</option>
  `).join("");
}

function renderMembers(state) {
  const root = document.getElementById("membersGrid");
  const empty = document.getElementById("membersEmptyState");
  if (!root || !empty) return;

  let members = [...state.members];

  if (state.search) {
    members = members.filter((m) => String(m.name || "").toLowerCase().includes(state.search));
  }

  if (state.guild !== "ALL") {
    members = members.filter((m) => (m.guild || "길드 없음") === state.guild);
  }

  members.sort((a, b) => {
    if (state.sort === "level") return Number(b.level || 0) - Number(a.level || 0);
    if (state.sort === "popularity") return Number(b.popularity || 0) - Number(a.popularity || 0);
    if (state.sort === "name") return String(a.name || "").localeCompare(String(b.name || ""), "ko");
    return Number(b.powerValue || 0) - Number(a.powerValue || 0);
  });

  if (!members.length) {
    root.innerHTML = "";
    empty.classList.remove("hidden");
    return;
  }

  empty.classList.add("hidden");

  root.innerHTML = members.map((member) => {
    const weekly = member.weekly || {};
    return `
      <article class="member-card">
        <div class="member-top">
          <div>
            <div class="member-rank">
              <span>패밀리 전투력 순위</span>
              <strong>#${formatNumber(member.familyRankByPower)}</strong>
            </div>
            <h3 class="member-name">${escapeHtml(member.name || "-")}</h3>
            <div class="member-real-guild">${escapeHtml(member.realGuild || "길드 없음")}</div>
          </div>
          <span class="guild-pill">${escapeHtml(member.guild || "길드 없음")}</span>
        </div>

        <div class="member-stats">
          <div class="member-stat"><span class="member-stat-label">레벨</span><strong class="member-stat-value">${formatNumber(member.level)}</strong></div>
          <div class="member-stat"><span class="member-stat-label">전투력</span><strong class="member-stat-value">${escapeHtml(member.powerText || "0")}</strong></div>
          <div class="member-stat"><span class="member-stat-label">인기도</span><strong class="member-stat-value">${formatNumber(member.popularity)}</strong></div>
          <div class="member-stat"><span class="member-stat-label">주간 전투력</span><strong class="member-stat-value ${getDiffClass(weekly.powerDiffValue)}">${escapeHtml(weekly.powerDiffText || "0")}</strong></div>
          <div class="member-stat"><span class="member-stat-label">주간 레벨</span><strong class="member-stat-value ${getDiffClass(weekly.levelDiff)}">${escapeHtml(weekly.levelDiffText || "0")}</strong></div>
          <div class="member-stat"><span class="member-stat-label">주간 인기도</span><strong class="member-stat-value ${getDiffClass(weekly.popularityDiff)}">${escapeHtml(weekly.popularityDiffText || "0")}</strong></div>
          <div class="member-stat"><span class="member-stat-label">주간 성장률</span><strong class="member-stat-value">${escapeHtml(weekly.growthRateText || "0%")}</strong></div>
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