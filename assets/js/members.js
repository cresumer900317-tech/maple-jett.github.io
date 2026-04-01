document.addEventListener("DOMContentLoaded", async () => {
  const data = await getHomeData();

  const state = {
    mode: window.location.hash === "#growth" ? "growth" : "directory",
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
    window.location.hash = state.mode === "growth" ? "growth" : "";
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
        <th>레벨</th>
        <th>전투력</th>
        <th>인기도</th>
        <th>주간 성장률</th>
      </tr>
    `;
    tableBody.innerHTML = rows.map((member) => `
      <tr class="clickable-row" data-member-name="${escapeHtml(member.name || "")}">
        <td><span class="rank-badge">${formatNumber(member.familyRankByPower)}</span></td>
        <td>
          <div class="name-cell">
            <span class="name-main">${escapeHtml(member.name || "-")}</span>
            <span class="name-sub">${escapeHtml(member.realGuild || member.guild || "길드 없음")}</span>
          </div>
        </td>
        <td><span class="guild-pill">${escapeHtml(member.guild || "길드 없음")}</span></td>
        <td>${formatNumber(member.level)}</td>
        <td>${escapeHtml(member.powerText || "0")}</td>
        <td>${formatNumber(member.popularity)}</td>
        <td>${escapeHtml(member.weekly?.growthRateText || "0%")}</td>
      </tr>
    `).join("");
  } else {
    rows.sort((a, b) => Number(b.weekly?.powerDiffValue || 0) - Number(a.weekly?.powerDiffValue || 0));
    title.textContent = "주간 성장";
    tableHead.innerHTML = `
      <tr>
        <th>순위</th>
        <th>캐릭터</th>
        <th>길드</th>
        <th>전투력 상승</th>
        <th>레벨 상승</th>
        <th>인기도 상승</th>
        <th>성장률</th>
      </tr>
    `;
    tableBody.innerHTML = rows.map((member, index) => `
      <tr class="clickable-row" data-member-name="${escapeHtml(member.name || "")}">
        <td><span class="rank-badge ${getRankBadgeClass(index + 1)}">${index + 1}</span></td>
        <td>
          <div class="name-cell">
            <span class="name-main">${escapeHtml(member.name || "-")}</span>
            <span class="name-sub">${escapeHtml(member.realGuild || member.guild || "길드 없음")}</span>
          </div>
        </td>
        <td><span class="guild-pill">${escapeHtml(member.guild || "길드 없음")}</span></td>
        <td class="${getDiffClass(member.weekly?.powerDiffValue)}">${escapeHtml(member.weekly?.powerDiffText || "0")}</td>
        <td class="${getDiffClass(member.weekly?.levelDiff)}">${escapeHtml(member.weekly?.levelDiffText || "0")}</td>
        <td class="${getDiffClass(member.weekly?.popularityDiff)}">${escapeHtml(member.weekly?.popularityDiffText || "0")}</td>
        <td>${escapeHtml(member.weekly?.growthRateText || "0%")}</td>
      </tr>
    `).join("");
  }

  if (!rows.length) {
    empty.classList.remove("hidden");
  } else {
    empty.classList.add("hidden");
  }

  tableBody.querySelectorAll(".clickable-row").forEach((row) => {
    row.addEventListener("click", () => {
      const name = row.dataset.memberName || "";
      const member = state.members.find((m) => String(m.name || "") === name);
      if (member) openMemberModal(member);
    });
  });
}

function compareMembers(a, b, sortKey) {
  if (sortKey === "level") return Number(b.level || 0) - Number(a.level || 0);
  if (sortKey === "popularity") return Number(b.popularity || 0) - Number(a.popularity || 0);
  if (sortKey === "name") return String(a.name || "").localeCompare(String(b.name || ""), "ko");
  return Number(b.powerValue || 0) - Number(a.powerValue || 0);
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
      <span>주간 전투력</span>
      <strong>${escapeHtml(member.weekly?.powerDiffText || "0")}</strong>
    </div>
    <div class="modal-member-stat">
      <span>주간 레벨</span>
      <strong>${escapeHtml(member.weekly?.levelDiffText || "0")}</strong>
    </div>
    <div class="modal-member-stat">
      <span>주간 인기도</span>
      <strong>${escapeHtml(member.weekly?.popularityDiffText || "0")}</strong>
    </div>
    <div class="modal-member-stat">
      <span>주간 성장률</span>
      <strong>${escapeHtml(member.weekly?.growthRateText || "0%")}</strong>
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