document.addEventListener("DOMContentLoaded", async () => {
  const data = await getHomeData();

  const state = {
    mode: "directory",
    members: data.members || [],
    search: "",
    guild: "ALL",
    sort: "power"
  };

  setupGuildOptions(data.guilds || []);
  bindMembersEvents(state);
  renderMembersPage(state);
  setupMemberModalClose();
});

function bindMembersEvents(state) {
  const tabs = document.getElementById("membersModeTabs");
  const search = document.getElementById("memberSearchInput");
  const guild = document.getElementById("guildFilterSelect");
  const sort = document.getElementById("sortSelect");

  tabs?.addEventListener("click", (event) => {
    const button = event.target.closest(".tab-btn");
    if (!button) return;

    tabs.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("is-active"));
    button.classList.add("is-active");

    state.mode = button.dataset.mode;
    renderMembersPage(state);
  });

  search?.addEventListener("input", (event) => {
    state.search = String(event.target.value || "").trim().toLowerCase();
    renderMembersPage(state);
  });

  guild?.addEventListener("change", (event) => {
    state.guild = event.target.value;
    renderMembersPage(state);
  });

  sort?.addEventListener("change", (event) => {
    state.sort = event.target.value;
    renderMembersPage(state);
  });
}

function setupGuildOptions(guilds) {
  const select = document.getElementById("guildFilterSelect");
  if (!select) return;

  const items = ["ALL", ...new Set(guilds.map((g) => g.guild).filter(Boolean))];
  select.innerHTML = items.map((item) => `
    <option value="${escapeHtml(item)}">${escapeHtml(item === "ALL" ? "전체 길드" : item)}</option>
  `).join("");
}

function renderMembersPage(state) {
  const tableHead = document.getElementById("membersTableHead");
  const tableBody = document.getElementById("membersTableBody");
  const empty = document.getElementById("membersEmptyState");
  const title = document.getElementById("membersPageTitle");
  if (!tableHead || !tableBody || !empty || !title) return;

  let rows = [...state.members];

  if (state.search) {
    rows = rows.filter((m) => String(m.name || "").toLowerCase().includes(state.search));
  }

  if (state.guild !== "ALL") {
    rows = rows.filter((m) => (m.guild || "길드 없음") === state.guild);
  }

  if (state.mode === "directory") {
    rows.sort((a, b) => compareMembers(a, b, state.sort));
    title.textContent = "인원 디렉토리";
    tableHead.innerHTML = `
      <tr>
        <th>순위</th>
        <th>캐릭터</th>
        <th>길드</th>
        <th>Lv</th>
        <th>전투력</th>
        <th>인기도</th>
        <th>상세</th>
      </tr>
    `;
    tableBody.innerHTML = rows.map((member) => `
      <tr>
        <td><span class="rank-badge">${formatNumber(member.familyRankByPower)}</span></td>
        <td>
          <div class="character-cell">
            ${renderCharacterAvatar(member.imageUrl, member.name)}
            <div class="character-meta">
              <div class="character-name-row">
                <span class="name-main">${escapeHtml(member.name || "-")}</span>
                <span class="rank-trend ${getRankTrendClass(member.weeklyRankDirection)}">
                  <strong>${escapeHtml(member.weeklyRankDiffText || "―")}</strong>
                </span>
              </div>
              <div class="name-sub-row">
                <span class="name-sub">${escapeHtml(member.realGuild || member.guild || "길드 없음")}</span>
              </div>
            </div>
          </div>
        </td>
        <td><span class="guild-pill ${getGuildClass(member.guild)}">${escapeHtml(member.guild || "길드 없음")}</span></td>
        <td>${formatNumber(member.level)}</td>
        <td>${escapeHtml(member.powerText || "0")}</td>
        <td>${formatNumber(member.popularity)}</td>
        <td><button class="detail-btn" data-member-name="${escapeHtml(member.name || "")}">상세보기</button></td>
      </tr>
    `).join("");
  } else {
    const config = getGrowthConfig(state.mode);
    rows.sort(config.sorter);
    title.textContent = config.title;
    tableHead.innerHTML = `
      <tr>
        <th>순위</th>
        <th>캐릭터</th>
        <th>길드</th>
        <th>${config.valueLabel}</th>
        <th>순위 변화</th>
        <th>상세</th>
      </tr>
    `;
    tableBody.innerHTML = rows.map((member, index) => `
      <tr>
        <td><span class="rank-badge ${getRankBadgeClass(index + 1)}">${index + 1}</span></td>
        <td>
          <div class="character-cell">
            ${renderCharacterAvatar(member.imageUrl, member.name)}
            <div class="character-meta">
              <div class="character-name-row">
                <span class="name-main">${escapeHtml(member.name || "-")}</span>
              </div>
              <div class="name-sub-row">
                <span class="name-sub">${escapeHtml(member.realGuild || member.guild || "길드 없음")}</span>
              </div>
            </div>
          </div>
        </td>
        <td><span class="guild-pill ${getGuildClass(member.guild)}">${escapeHtml(member.guild || "길드 없음")}</span></td>
        <td class="${config.classGetter(member)}">${escapeHtml(config.valueGetter(member))}</td>
        <td><span class="rank-trend ${getRankTrendClass(member.weeklyRankDirection)}"><strong>${escapeHtml(member.weeklyRankDiffText || "―")}</strong></span></td>
        <td><button class="detail-btn" data-member-name="${escapeHtml(member.name || "")}">상세보기</button></td>
      </tr>
    `).join("");
  }

  if (!rows.length) {
    empty.classList.remove("hidden");
  } else {
    empty.classList.add("hidden");
  }

  tableBody.querySelectorAll(".detail-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.memberName || "";
      const member = state.members.find((m) => String(m.name || "") === name);
      if (member) openMemberModal(member);
    });
  });
}

function getGrowthConfig(mode) {
  if (mode === "levelGrowth") {
    return {
      title: "레벨 상승 순위",
      valueLabel: "레벨 상승",
      valueGetter: (m) => m.weekly?.levelDiffText || "0",
      classGetter: (m) => getDiffClass(m.weekly?.levelDiff),
      sorter: (a, b) => Number(b.weekly?.levelDiff || 0) - Number(a.weekly?.levelDiff || 0)
    };
  }

  if (mode === "popularityGrowth") {
    return {
      title: "인기도 상승 순위",
      valueLabel: "인기도 상승",
      valueGetter: (m) => m.weekly?.popularityDiffText || "0",
      classGetter: (m) => getDiffClass(m.weekly?.popularityDiff),
      sorter: (a, b) => Number(b.weekly?.popularityDiff || 0) - Number(a.weekly?.popularityDiff || 0)
    };
  }

  if (mode === "rateGrowth") {
    return {
      title: "성장률 상승 순위",
      valueLabel: "성장률",
      valueGetter: (m) => m.weekly?.growthRateText || "0%",
      classGetter: () => "",
      sorter: (a, b) => parseGrowthRate(b.weekly?.growthRateText) - parseGrowthRate(a.weekly?.growthRateText)
    };
  }

  return {
    title: "전투력 상승 순위",
    valueLabel: "전투력 상승",
    valueGetter: (m) => m.weekly?.powerDiffText || "0",
    classGetter: (m) => getDiffClass(m.weekly?.powerDiffValue),
    sorter: (a, b) => Number(b.weekly?.powerDiffValue || 0) - Number(a.weekly?.powerDiffValue || 0)
  };
}

function compareMembers(a, b, sortKey) {
  if (sortKey === "level") return Number(b.level || 0) - Number(a.level || 0);
  if (sortKey === "popularity") return Number(b.popularity || 0) - Number(a.popularity || 0);
  if (sortKey === "name") return String(a.name || "").localeCompare(String(b.name || ""), "ko");
  return Number(b.powerValue || 0) - Number(a.powerValue || 0);
}

function parseGrowthRate(text) {
  const n = String(text || "0").replace("%", "").replaceAll(",", "").trim();
  return Number(n) || 0;
}

function openMemberModal(member) {
  const modal = document.getElementById("memberDetailModal");
  const title = document.getElementById("memberModalTitle");
  const meta = document.getElementById("memberModalMeta");
  const weekly = document.getElementById("memberModalWeeklyGrid");
  if (!modal || !title || !meta || !weekly) return;

  title.textContent = member.name || "-";

  meta.innerHTML = `
    <div class="modal-meta-card">
      <span>길드</span>
      <strong>${escapeHtml(member.guild || "길드 없음")}</strong>
    </div>
    <div class="modal-meta-card">
      <span>레벨</span>
      <strong>${formatNumber(member.level)}</strong>
    </div>
    <div class="modal-meta-card">
      <span>전투력</span>
      <strong>${escapeHtml(member.powerText || "0")}</strong>
    </div>
    <div class="modal-meta-card">
      <span>인기도</span>
      <strong>${formatNumber(member.popularity)}</strong>
    </div>
  `;

  weekly.innerHTML = `
    <div class="modal-member-stat">
      <span>주간 순위 변화</span>
      <strong class="${getRankTrendClass(member.weeklyRankDirection)}">${escapeHtml(member.weeklyRankDiffText || "―")}</strong>
    </div>
    <div class="modal-member-stat">
      <span>주간 전투력</span>
      <strong class="${getDiffClass(member.weekly?.powerDiffValue)}">${escapeHtml(member.weekly?.powerDiffText || "0")}</strong>
    </div>
    <div class="modal-member-stat">
      <span>주간 레벨</span>
      <strong class="${getDiffClass(member.weekly?.levelDiff)}">${escapeHtml(member.weekly?.levelDiffText || "0")}</strong>
    </div>
    <div class="modal-member-stat">
      <span>주간 인기도</span>
      <strong class="${getDiffClass(member.weekly?.popularityDiff)}">${escapeHtml(member.weekly?.popularityDiffText || "0")}</strong>
    </div>
  `;

  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeMemberModal() {
  const modal = document.getElementById("memberDetailModal");
  if (!modal) return;
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function setupMemberModalClose() {
  const closeBtn = document.getElementById("memberModalClose");
  const modal = document.getElementById("memberDetailModal");
  if (!modal) return;

  closeBtn?.addEventListener("click", closeMemberModal);

  modal.querySelectorAll("[data-close-member-modal='true']").forEach((el) => {
    el.addEventListener("click", closeMemberModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMemberModal();
  });
}