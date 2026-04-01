(function () {
  const state = {
    page: document.body.dataset.page || "home",
    data: JSON.parse(JSON.stringify(window.DEFAULT_HOME_DATA || {})),
    rankingTab: "power",
    membersMode: location.hash === "#growth" ? "powerGrowth" : "directory",
    guildFilter: "ALL",
    sortBy: "power",
    search: ""
  };

  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    renderShell();
    bindCommon();
    await loadBaseData();
    routePage();
  }

  function renderShell() {
    const shell = document.getElementById("app-shell");
    if (!shell) return;
    const nav = (window.APP_CONFIG?.NAV || []).map(item => {
      const active = item.key === state.page ? "is-active" : "";
      return `<a class="${active}" href="${item.path}">${item.label}</a>`;
    }).join("");
    shell.innerHTML = `
      <header class="site-header">
        <div class="container">
          <a class="brand" href="./index.html">
            <div class="brand-mark">친</div>
            <div class="brand-copy">
              <div class="brand-title">친구패밀리 포털</div>
              <div class="brand-sub">밝고 정돈된 길드 랭킹 허브</div>
            </div>
          </a>
          <nav class="nav">${nav}</nav>
        </div>
      </header>
    `;
  }

  function bindCommon() {
    document.addEventListener("click", (e) => {
      if (e.target.matches("[data-close-modal='true']") || e.target.id === "guildModalClose") hideModal("guildDetailModal");
      if (e.target.matches("[data-close-member-modal='true']") || e.target.id === "memberModalClose") hideModal("memberDetailModal");
      if (e.target.matches("[data-close-ranking-modal='true']") || e.target.id === "rankingMemberModalClose") hideModal("rankingMemberDetailModal");
    });
  }

  async function loadBaseData() {
    try {
      const home = await fetchApi("home");
      state.data = normalizeHomeData(home);
    } catch (e) {
      console.warn(e);
      state.data = normalizeHomeData(window.DEFAULT_HOME_DATA);
    }
  }

  async function fetchApi(mode) {
    const base = (window.APP_CONFIG?.API_BASE_URL || "").trim();
    if (!base) throw new Error("API_BASE_URL not set");
    const url = new URL(base);
    url.searchParams.set("mode", mode);
    url.searchParams.set("_ts", Date.now().toString());
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) throw new Error(`API ${mode} ${res.status}`);
    return await res.json();
  }

  function routePage() {
    setFooter();
    if (state.page === "home") renderHome();
    if (state.page === "ranking") renderRankingPage();
    if (state.page === "members") renderMembersPage();
    if (state.page === "notice") renderBoardPage("notice");
    if (state.page === "tips") renderBoardPage("tips");
  }

  function renderHome() {
    setText("latestSnapshotAt", formatDateTime(state.data.meta.latestSnapshotAt));
    setText("weeklyBaseAt", formatDateTime(state.data.meta.weeklyBaseAt));
    setText("weekRange", state.data.meta.weekRange || "-");
    const apiStatus = document.getElementById("apiStatus");
    if (apiStatus) { apiStatus.textContent = (window.APP_CONFIG?.API_BASE_URL || "") ? "LIVE" : "DEMO"; apiStatus.classList.add("is-ok"); }

    fillHtml("summaryCards", [
      card("총 인원", formatNumber(state.data.summary.memberCount)),
      card("평균 레벨", formatDecimal(state.data.summary.avgLevel)),
      card("평균 전투력", state.data.summary.avgPowerText || "0"),
      card("성장 인원", `${formatNumber(state.data.summary.positiveGrowthMembers.power)}명`)
    ].join(""));

    fillHtml("guildGrid", buildGuildCards(state.data.guilds));
    fillHtml("homeRankingPreviewBody", buildRankingRows((state.data.rankings.power || []).slice(0, 30), true));
    fillHtml("homeNoticeCompact", `<div class="empty-state">공지 데이터를 불러오려면 README의 API 설정을 적용하세요.</div>`);

    fillHtml("homeTopPower", buildTopList(state.data.weeklyTop.power || [], "power"));
    fillHtml("homeTopLevel", buildTopList(state.data.weeklyTop.level || [], "level"));

    document.querySelectorAll("[data-guild]").forEach(el => el.addEventListener("click", () => openGuildModal(el.dataset.guild)));
  }

  function renderRankingPage() {
    bindRankingTabs();
    bindRankingSearch();
    renderRankingTableSection();
  }

  function bindRankingTabs() {
    document.querySelectorAll("#rankingTabs .tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("#rankingTabs .tab-btn").forEach(x => x.classList.remove("is-active"));
        btn.classList.add("is-active");
        state.rankingTab = btn.dataset.tab;
        renderRankingTableSection();
      });
    });
  }

  function bindRankingSearch() {
    const input = document.getElementById("rankingSearchInput");
    const button = document.getElementById("rankingSearchButton");
    if (!input || !button) return;
    const run = () => {
      const query = input.value.trim().toLowerCase();
      const rows = Array.from(document.querySelectorAll("#rankingTableBody tr[data-name]"));
      rows.forEach(r => r.classList.remove("is-highlight"));
      const found = rows.find(r => (r.dataset.name || "").toLowerCase().includes(query));
      const status = document.getElementById("rankingSearchStatus");
      if (found) {
        found.scrollIntoView({ behavior: "smooth", block: "center" });
        found.style.background = "#eef6ff";
        setTimeout(() => { found.style.background = ""; }, 1800);
        if (status) status.textContent = `${found.dataset.name} 위치로 이동했습니다.`;
      } else if (status) {
        status.textContent = query ? "검색 결과가 없습니다." : "검색 시 해당 순위로 이동합니다.";
      }
    };
    button.addEventListener("click", run);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") run(); });
  }

  function renderRankingTableSection() {
    const rows = state.data.rankings[state.rankingTab] || [];
    setText("rankingMetricLabel", state.rankingTab === "power" ? "전투력" : state.rankingTab === "level" ? "레벨" : "인기도");
    setText("rankingCountLabel", `전체 ${formatNumber(rows.length)}명`);
    fillHtml("rankingTableBody", buildRankingRows(rows, false));
    document.querySelectorAll("[data-open-member]").forEach(el => el.addEventListener("click", () => openMemberModal(findMember(el.dataset.openMember), "ranking")));
  }

  function renderMembersPage() {
    bindMembersControls();
    renderMembersTable();
  }

  function bindMembersControls() {
    document.querySelectorAll("#membersModeTabs .tab-btn").forEach(btn => {
      btn.classList.toggle("is-active", btn.dataset.mode === state.membersMode);
      btn.addEventListener("click", () => {
        document.querySelectorAll("#membersModeTabs .tab-btn").forEach(x => x.classList.remove("is-active"));
        btn.classList.add("is-active");
        state.membersMode = btn.dataset.mode;
        renderMembersTable();
      });
    });
    const search = document.getElementById("memberSearchInput");
    const guild = document.getElementById("guildFilterSelect");
    const sort = document.getElementById("sortSelect");
    const guildOptions = ["ALL", ...new Set((state.data.guilds || []).map(x => x.guild).filter(Boolean))];
    if (guild) guild.innerHTML = guildOptions.map(v => `<option value="${escapeHtml(v)}">${v === "ALL" ? "전체 길드" : escapeHtml(v)}</option>`).join("");
    if (search) search.addEventListener("input", () => { state.search = search.value.trim().toLowerCase(); renderMembersTable(); });
    if (guild) guild.addEventListener("change", () => { state.guildFilter = guild.value; renderMembersTable(); });
    if (sort) sort.addEventListener("change", () => { state.sortBy = sort.value; renderMembersTable(); });
  }

  function renderMembersTable() {
    const tableHead = document.getElementById("membersTableHead");
    const tableBody = document.getElementById("membersTableBody");
    const title = document.getElementById("membersPageTitle");
    if (!tableHead || !tableBody) return;
    const rows = getMembersModeRows();
    const filtered = rows.filter(r => {
      const q = !state.search || (r.name || "").toLowerCase().includes(state.search);
      const g = state.guildFilter === "ALL" || r.guild === state.guildFilter;
      return q && g;
    });
    if (title) title.textContent = getMembersModeTitle();
    const head = getMembersModeHead();
    tableHead.innerHTML = `<tr>${head.map(h => `<th>${h}</th>`).join("")}</tr>`;
    tableBody.innerHTML = filtered.length ? filtered.map(buildMembersRow).join("") : `<tr><td colspan="8"><div class="empty-state">조건에 맞는 캐릭터가 없습니다.</div></td></tr>`;
    document.querySelectorAll("[data-open-member]").forEach(el => el.addEventListener("click", () => openMemberModal(findMember(el.dataset.openMember), "member")));
  }

  async function renderBoardPage(mode) {
    const targetId = mode === "notice" ? "noticeList" : "tipsList";
    const target = document.getElementById(targetId);
    if (!target) return;
    try {
      const data = await fetchApi(mode);
      const posts = Array.isArray(data.posts) ? data.posts : [];
      target.innerHTML = posts.length ? posts.map(post => `
        <article class="board-item">
          <div class="board-meta">
            <span class="badge ${post.isPinned ? "is-gold" : ""}">${post.isPinned ? "PINNED" : escapeHtml(post.category || "게시글")}</span>
            <span>${escapeHtml(post.author || "운영진")}</span>
            <span>${escapeHtml(formatDateTime(post.createdAt))}</span>
          </div>
          <h3>${escapeHtml(post.title || "제목 없음")}</h3>
          <div class="page-desc">${escapeHtml(post.content || "")}</div>
        </article>
      `).join("") : `<div class="empty-state">등록된 게시글이 없습니다.</div>`;
    } catch (e) {
      target.innerHTML = `<div class="empty-state">게시글 데이터를 불러오지 못했습니다. README의 API 설정을 확인하세요.</div>`;
    }
  }

  function getMembersModeRows() {
    const members = [...(state.data.members || [])];
    if (state.guildFilter !== "ALL") {
      // filtering later
    }
    if (state.membersMode === "directory") {
      return members.sort(memberSorter(state.sortBy));
    }
    if (state.membersMode === "powerGrowth") {
      return members.filter(m => Number(m.weekly?.powerDiffValue || 0) > 0).sort((a, b) => Number(b.weekly?.powerDiffValue || 0) - Number(a.weekly?.powerDiffValue || 0));
    }
    if (state.membersMode === "levelGrowth") {
      return members.filter(m => Number(m.weekly?.levelDiff || 0) > 0).sort((a, b) => Number(b.weekly?.levelDiff || 0) - Number(a.weekly?.levelDiff || 0));
    }
    if (state.membersMode === "popularityGrowth") {
      return members.filter(m => Number(m.weekly?.popularityDiff || 0) > 0).sort((a, b) => Number(b.weekly?.popularityDiff || 0) - Number(a.weekly?.popularityDiff || 0));
    }
    return members.filter(m => parsePercent(m.weekly?.growthRateText) > 0).sort((a, b) => parsePercent(b.weekly?.growthRateText) - parsePercent(a.weekly?.growthRateText));
  }

  function getMembersModeHead() {
    if (state.membersMode === "directory") return ["가문순위", "캐릭터", "길드", "Lv", "전투력", "인기도", "서버랭킹", "상세"];
    if (state.membersMode === "powerGrowth") return ["순위", "캐릭터", "길드", "현재 전투력", "주간 증감", "성장률", "서버랭킹", "상세"];
    if (state.membersMode === "levelGrowth") return ["순위", "캐릭터", "길드", "현재 레벨", "주간 증감", "전투력", "서버랭킹", "상세"];
    if (state.membersMode === "popularityGrowth") return ["순위", "캐릭터", "길드", "현재 인기도", "주간 증감", "전투력", "서버랭킹", "상세"];
    return ["순위", "캐릭터", "길드", "성장률", "주간 전투력 증감", "현재 전투력", "서버랭킹", "상세"];
  }

  function getMembersModeTitle() {
    return ({ directory: "인원 디렉토리", powerGrowth: "전투력 상승", levelGrowth: "레벨 상승", popularityGrowth: "인기도 상승", rateGrowth: "성장률 상승" })[state.membersMode];
  }

  function buildMembersRow(member, index) {
    const guild = escapeHtml(member.guild || "길드 없음");
    const serverRank = formatNullableRank(member.serverRank);
    if (state.membersMode === "directory") return `
      <tr data-name="${escapeHtml(member.name || "")}">
        <td><span class="rank-badge ${getRankBadgeClass(index + 1)}">${formatNumber(member.familyRankByPower)}</span></td>
        <td><div class="name-cell"><span class="name-main">${escapeHtml(member.name || "-")}</span><span class="name-sub">전체 ${formatNullableRank(member.overallRank)}</span></div></td>
        <td><span class="guild-pill ${getGuildClassName(member.guild)}">${guild}</span></td>
        <td>${formatNumber(member.level)}</td>
        <td>${escapeHtml(member.powerText || "0")}</td>
        <td>${formatNumber(member.popularity)}</td>
        <td>${serverRank}</td>
        <td><button class="primary-btn" data-open-member="${escapeHtml(member.name || "")}" type="button">보기</button></td>
      </tr>`;

    if (state.membersMode === "powerGrowth") return `
      <tr data-name="${escapeHtml(member.name || "")}">
        <td><span class="rank-badge ${getRankBadgeClass(index + 1)}">${index + 1}</span></td>
        <td><div class="name-cell"><span class="name-main">${escapeHtml(member.name || "-")}</span><span class="name-sub">전체 ${formatNullableRank(member.overallRank)}</span></div></td>
        <td><span class="guild-pill ${getGuildClassName(member.guild)}">${guild}</span></td>
        <td>${escapeHtml(member.powerText || "0")}</td>
        <td class="${getDiffClass(member.weekly?.powerDiffValue)}">${escapeHtml(member.weekly?.powerDiffText || "0")}</td>
        <td class="${getDiffClass(parsePercent(member.weekly?.growthRateText))}">${escapeHtml(member.weekly?.growthRateText || "0%")}</td>
        <td>${serverRank}</td>
        <td><button class="primary-btn" data-open-member="${escapeHtml(member.name || "")}" type="button">보기</button></td>
      </tr>`;

    if (state.membersMode === "levelGrowth") return `
      <tr data-name="${escapeHtml(member.name || "")}">
        <td><span class="rank-badge ${getRankBadgeClass(index + 1)}">${index + 1}</span></td>
        <td><div class="name-cell"><span class="name-main">${escapeHtml(member.name || "-")}</span><span class="name-sub">전체 ${formatNullableRank(member.overallRank)}</span></div></td>
        <td><span class="guild-pill ${getGuildClassName(member.guild)}">${guild}</span></td>
        <td>${formatNumber(member.level)}</td>
        <td class="${getDiffClass(member.weekly?.levelDiff)}">${escapeHtml(member.weekly?.levelDiffText || "0")}</td>
        <td>${escapeHtml(member.powerText || "0")}</td>
        <td>${serverRank}</td>
        <td><button class="primary-btn" data-open-member="${escapeHtml(member.name || "")}" type="button">보기</button></td>
      </tr>`;

    if (state.membersMode === "popularityGrowth") return `
      <tr data-name="${escapeHtml(member.name || "")}">
        <td><span class="rank-badge ${getRankBadgeClass(index + 1)}">${index + 1}</span></td>
        <td><div class="name-cell"><span class="name-main">${escapeHtml(member.name || "-")}</span><span class="name-sub">전체 ${formatNullableRank(member.overallRank)}</span></div></td>
        <td><span class="guild-pill ${getGuildClassName(member.guild)}">${guild}</span></td>
        <td>${formatNumber(member.popularity)}</td>
        <td class="${getDiffClass(member.weekly?.popularityDiff)}">${escapeHtml(member.weekly?.popularityDiffText || "0")}</td>
        <td>${escapeHtml(member.powerText || "0")}</td>
        <td>${serverRank}</td>
        <td><button class="primary-btn" data-open-member="${escapeHtml(member.name || "")}" type="button">보기</button></td>
      </tr>`;

    return `
      <tr data-name="${escapeHtml(member.name || "")}">
        <td><span class="rank-badge ${getRankBadgeClass(index + 1)}">${index + 1}</span></td>
        <td><div class="name-cell"><span class="name-main">${escapeHtml(member.name || "-")}</span><span class="name-sub">전체 ${formatNullableRank(member.overallRank)}</span></div></td>
        <td><span class="guild-pill ${getGuildClassName(member.guild)}">${guild}</span></td>
        <td class="${getDiffClass(parsePercent(member.weekly?.growthRateText))}">${escapeHtml(member.weekly?.growthRateText || "0%")}</td>
        <td class="${getDiffClass(member.weekly?.powerDiffValue)}">${escapeHtml(member.weekly?.powerDiffText || "0")}</td>
        <td>${escapeHtml(member.powerText || "0")}</td>
        <td>${serverRank}</td>
        <td><button class="primary-btn" data-open-member="${escapeHtml(member.name || "")}" type="button">보기</button></td>
      </tr>`;
  }

  function openGuildModal(guildName) {
    const guild = (state.data.guilds || []).find(x => x.guild === guildName);
    if (!guild) return;
    setText("guildModalTitle", guild.guild || "길드 상세");
    fillHtml("guildModalMeta", [
      modalStat("인원수", formatNumber(guild.memberCount)),
      modalStat("평균 레벨", formatDecimal(guild.avgLevel)),
      modalStat("평균 전투력", guild.avgPowerText || "0"),
      modalStat("주간 전투력 증감", guild.weeklyPowerDiffText || "0"),
      modalStat("레벨업 인원", formatNumber(guild.weeklyLevelUpCount)),
      modalStat("인기도 증가합", formatNumber(guild.weeklyPopularityDiffSum))
    ].join(""));
    const topMembers = (state.data.members || []).filter(m => m.guild === guildName).sort((a, b) => (b.powerValue || 0) - (a.powerValue || 0)).slice(0, 5);
    fillHtml("guildModalTopMembers", topMembers.length ? `<div class="table-wrap"><table class="ranking-table"><thead><tr><th>이름</th><th>레벨</th><th>전투력</th><th>주간 증감</th></tr></thead><tbody>${topMembers.map(m => `<tr><td>${escapeHtml(m.name)}</td><td>${formatNumber(m.level)}</td><td>${escapeHtml(m.powerText || "0")}</td><td class="${getDiffClass(m.weekly?.powerDiffValue)}">${escapeHtml(m.weekly?.powerDiffText || "0")}</td></tr>`).join("")}</tbody></table></div>` : `<div class="empty-state">길드 멤버 데이터가 없습니다.</div>`);
    showModal("guildDetailModal");
  }

  function openMemberModal(member, scope) {
    if (!member) return;
    const prefix = scope === "ranking" ? "rankingMember" : "member";
    setText(`${prefix}ModalTitle`, member.name || "캐릭터 상세");
    fillHtml(`${prefix}ModalMeta`, [
      modalStat("길드", member.guild || "길드 없음"),
      modalStat("레벨", formatNumber(member.level)),
      modalStat("전투력", member.powerText || "0"),
      modalStat("인기도", formatNumber(member.popularity)),
      modalStat("전체랭킹", formatNullableRank(member.overallRank)),
      modalStat("서버랭킹", formatNullableRank(member.serverRank))
    ].join(""));
    fillHtml(`${prefix}ModalWeeklyGrid`, [
      modalStat("주간 전투력 증감", member.weekly?.powerDiffText || "0"),
      modalStat("주간 성장률", member.weekly?.growthRateText || "0%"),
      modalStat("주간 레벨 증감", member.weekly?.levelDiffText || "0"),
      modalStat("주간 인기도 증감", member.weekly?.popularityDiffText || "0"),
      modalStat("서버 순위 변화", member.weeklyRankDiffText || "―"),
      modalStat("가문 내 전투력 순위", formatNumber(member.familyRankByPower))
    ].join(""));
    showModal(scope === "ranking" ? "rankingMemberDetailModal" : "memberDetailModal");
  }

  function buildGuildCards(guilds) {
    if (!guilds?.length) return `<div class="empty-state">길드 요약 데이터가 없습니다.</div>`;
    return guilds.map(guild => `
      <article class="guild-card ${getGuildClassName(guild.guild)}">
        <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;">
          <h3>${escapeHtml(guild.guild || "길드 없음")}</h3>
          <span class="pill">${formatNumber(guild.memberCount)}명</span>
        </div>
        <div class="guild-stats">
          <div class="guild-stat-row"><span class="guild-stat-label">평균 레벨</span><strong class="guild-stat-value">${formatDecimal(guild.avgLevel)}</strong></div>
          <div class="guild-stat-row"><span class="guild-stat-label">평균 전투력</span><strong class="guild-stat-value">${escapeHtml(guild.avgPowerText || "0")}</strong></div>
          <div class="guild-stat-row"><span class="guild-stat-label">주간 전투력 증감</span><strong class="guild-stat-value ${getDiffClass(guild.weeklyPowerDiffValue)}">${escapeHtml(guild.weeklyPowerDiffText || "0")}</strong></div>
          <div class="guild-stat-row"><span class="guild-stat-label">주간 레벨업 인원</span><strong class="guild-stat-value">${formatNumber(guild.weeklyLevelUpCount)}</strong></div>
        </div>
        <div style="margin-top:14px"><button class="primary-btn" type="button" data-guild="${escapeHtml(guild.guild || "")}">길드 상세 보기</button></div>
      </article>`).join("");
  }

  function buildTopList(rows, mode) {
    if (!rows?.length) return `<div class="empty-state">표시할 데이터가 없습니다.</div>`;
    return `<div class="top-list">${rows.slice(0, 5).map((row, idx) => `
      <div class="top-item">
        <div class="top-rank">${idx + 1}</div>
        <div class="top-main">
          <div class="top-name">${escapeHtml(row.name || "-")}</div>
          <div class="top-sub">${escapeHtml(row.guild || "길드 없음")} · 서버 ${formatNullableRank(row.serverRank)}</div>
        </div>
        <div class="top-value ${getDiffClass(mode === "power" ? row.diffValue : row.diff)}">${escapeHtml(mode === "power" ? (row.diffText || "0") : (row.diffText || "0"))}</div>
      </div>`).join("")}</div>`;
  }

  function buildRankingRows(rows, compact) {
    if (!rows?.length) return `<tr><td colspan="${compact ? 5 : 7}"><div class="empty-state">랭킹 데이터가 없습니다.</div></td></tr>`;
    return rows.map(row => `
      <tr data-name="${escapeHtml(row.name || "")}">
        <td><span class="rank-badge ${getRankBadgeClass(row.rank)}">${formatNumber(row.rank)}</span></td>
        <td>
          <div class="name-cell">
            <span class="name-main">${escapeHtml(row.name || "-")}</span>
            <span class="name-sub">전체 ${formatNullableRank(row.overallRank)} · 서버 ${formatNullableRank(row.serverRank)}</span>
          </div>
        </td>
        <td><span class="guild-pill ${getGuildClassName(row.guild)}">${escapeHtml(row.guild || "길드 없음")}</span></td>
        <td>${formatNumber(row.level)}</td>
        <td>${escapeHtml(row.powerText || "0")}</td>
        ${compact ? "" : `<td>${formatNumber(row.popularity)}</td><td><button class="primary-btn" data-open-member="${escapeHtml(row.name || "")}" type="button">보기</button></td>`}
      </tr>`).join("");
  }

  function memberSorter(sortBy) {
    return (a, b) => {
      if (sortBy === "level") return (b.level || 0) - (a.level || 0);
      if (sortBy === "popularity") return (b.popularity || 0) - (a.popularity || 0);
      if (sortBy === "name") return String(a.name || "").localeCompare(String(b.name || ""), "ko");
      return (b.powerValue || 0) - (a.powerValue || 0);
    };
  }

  function findMember(name) { return (state.data.members || []).find(m => m.name === name); }
  function normalizeHomeData(data) {
    return {
      ok: Boolean(data?.ok),
      meta: { generatedAt: data?.meta?.generatedAt ?? null, latestSnapshotAt: data?.meta?.latestSnapshotAt ?? null, weeklyBaseAt: data?.meta?.weeklyBaseAt ?? null, memberCount: Number(data?.meta?.memberCount ?? 0), weekRange: data?.meta?.weekRange ?? "-" },
      summary: { memberCount: Number(data?.summary?.memberCount ?? 0), avgLevel: Number(data?.summary?.avgLevel ?? 0), avgPowerText: data?.summary?.avgPowerText ?? "0", avgPopularity: Number(data?.summary?.avgPopularity ?? 0), positiveGrowthMembers: { power: Number(data?.summary?.positiveGrowthMembers?.power ?? 0), level: Number(data?.summary?.positiveGrowthMembers?.level ?? 0), popularity: Number(data?.summary?.positiveGrowthMembers?.popularity ?? 0) } },
      guilds: Array.isArray(data?.guilds) ? data.guilds : [],
      rankings: { power: Array.isArray(data?.rankings?.power) ? data.rankings.power : [], level: Array.isArray(data?.rankings?.level) ? data.rankings.level : [], popularity: Array.isArray(data?.rankings?.popularity) ? data.rankings.popularity : [] },
      weeklyTop: { power: Array.isArray(data?.weeklyTop?.power) ? data.weeklyTop.power : [], level: Array.isArray(data?.weeklyTop?.level) ? data.weeklyTop.level : [], popularity: Array.isArray(data?.weeklyTop?.popularity) ? data.weeklyTop.popularity : [] },
      members: Array.isArray(data?.members) ? data.members : []
    };
  }
  function modalStat(label, value) { return `<div class="modal-stat"><span>${escapeHtml(label)}</span><strong>${escapeHtml(String(value ?? "-"))}</strong></div>`; }
  function card(label, value) { return `<article class="summary-card"><span>${escapeHtml(label)}</span><strong>${escapeHtml(String(value))}</strong></article>`; }
  function getGuildClassName(guild) { return ({ "친구들":"guild-1", "친구둘":"guild-2", "친구삼":"guild-3", "친구넷":"guild-4", "친구닷":"guild-5" })[guild] || "guild-0"; }
  function getRankBadgeClass(rank) { return rank === 1 ? "is-gold" : rank === 2 ? "is-silver" : rank === 3 ? "is-bronze" : ""; }
  function getDiffClass(value) { const n = Number(value || 0); return n > 0 ? "diff-positive" : n < 0 ? "diff-negative" : "diff-neutral"; }
  function formatNullableRank(v) { return v == null || v === "" ? "-" : `${formatNumber(v)}위`; }
  function formatNumber(v) { const n = Number(v || 0); return Number.isFinite(n) ? n.toLocaleString("ko-KR") : "0"; }
  function formatDecimal(v) { const n = Number(v || 0); return Number.isFinite(n) ? (Math.round(n * 100) / 100).toLocaleString("ko-KR") : "0"; }
  function formatDateTime(v) { if (!v) return "-"; const d = new Date(v); if (Number.isNaN(d.getTime())) return String(v); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`; }
  function parsePercent(v) { return Number(String(v || "0").replace("%", "")) || 0; }
  function setText(id, text) { const el = document.getElementById(id); if (el) el.textContent = text; }
  function fillHtml(id, html) { const el = document.getElementById(id); if (el) el.innerHTML = html; }
  function showModal(id) { const el = document.getElementById(id); if (el) el.classList.remove("hidden"); }
  function hideModal(id) { const el = document.getElementById(id); if (el) el.classList.add("hidden"); }
  function pad(n) { return String(n).padStart(2, "0"); }
  function escapeHtml(s) { return String(s ?? "").replace(/[&<>\"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch])); }
  function setFooter() {
    if (document.querySelector(".footer")) return;
    const footer = document.createElement("footer");
    footer.className = "footer";
    footer.innerHTML = `<div class="container">친구패밀리 포털 · README의 API_BASE_URL을 설정하면 실시간 데이터와 공지/팁 게시판이 연결됩니다.</div>`;
    document.body.appendChild(footer);
  }
})();
