document.addEventListener("DOMContentLoaded", async () => {
  const data = await getHomeData();
  const state = {
    tab: "power",
    rows: data.rankings.power || [],
    members: data.members || []
  };

  renderRankingTable(state.rows, state.tab, state.members);
  updateRankingSidebar("전투력", state.rows.length);
  setupRankingModalClose();

  const tabs = document.getElementById("rankingTabs");
  const searchInput = document.getElementById("rankingSearchInput");
  const searchButton = document.getElementById("rankingSearchButton");

  tabs?.addEventListener("click", (event) => {
    const button = event.target.closest(".tab-btn");
    if (!button) return;

    tabs.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("is-active"));
    button.classList.add("is-active");

    state.tab = button.dataset.tab;
    state.rows = data.rankings[state.tab] || [];
    renderRankingTable(state.rows, state.tab, state.members);
    updateRankingSidebar(getMetricLabel(state.tab), state.rows.length);
    resetSearchStatus();
  });

  searchButton?.addEventListener("click", () => {
    performRankingSearch(state.rows);
  });

  searchInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      performRankingSearch(state.rows);
    }
  });
});

function renderRankingTable(rows, tab, members) {
  const tbody = document.getElementById("rankingTableBody");
  if (!tbody) return;

  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state">랭킹 데이터가 없습니다.</div></td></tr>`;
    return;
  }

  tbody.innerHTML = rows.map((row, index) => `
    <tr data-rank-index="${index}">
      <td><span class="rank-badge ${getRankBadgeClass(row.rank)}">${escapeHtml(String(row.rank ?? "-"))}</span></td>
      <td>
        <div class="name-cell">
          <span class="name-main">${escapeHtml(row.name || "-")}</span>
          <span class="name-sub">전체 ${formatNullableRank(row.overallRank)} / 서버 ${formatNullableRank(row.serverRank)}</span>
        </div>
      </td>
      <td><span class="guild-pill ${getGuildClass(row.guild)}">${escapeHtml(row.guild || "길드 없음")}</span></td>
      <td>${formatNumber(row.level)}</td>
      <td>${escapeHtml(row.powerText || "0")}</td>
      <td>${formatNumber(row.popularity)}</td>
      <td><button class="detail-btn" data-member-name="${escapeHtml(row.name || "")}">상세보기</button></td>
    </tr>
  `).join("");

  tbody.querySelectorAll(".detail-btn").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      const name = btn.dataset.memberName || "";
      const member = members.find((m) => String(m.name || "") === name);
      if (member) openRankingMemberModal(member);
    });
  });
}

function performRankingSearch(rows) {
  const input = document.getElementById("rankingSearchInput");
  const status = document.getElementById("rankingSearchStatus");
  const scrollArea = document.getElementById("rankingScrollArea");
  const tbody = document.getElementById("rankingTableBody");
  if (!input || !status || !scrollArea || !tbody) return;

  const keyword = String(input.value || "").trim().toLowerCase();
  clearRankingHighlights();

  if (!keyword) {
    status.textContent = "검색어를 입력해 주세요.";
    return;
  }

  const matchIndex = rows.findIndex((row) =>
    String(row.name || "").toLowerCase().includes(keyword)
  );

  if (matchIndex === -1) {
    status.textContent = "검색 결과가 없습니다.";
    return;
  }

  const targetRow = tbody.querySelector(`tr[data-rank-index="${matchIndex}"]`);
  if (!targetRow) {
    status.textContent = "검색 결과가 없습니다.";
    return;
  }

  targetRow.classList.add("is-target");

  const offsetTop = targetRow.offsetTop - scrollArea.clientHeight / 2 + targetRow.clientHeight * 2;
  scrollArea.scrollTo({
    top: Math.max(offsetTop, 0),
    behavior: "smooth"
  });

  status.textContent = `검색 결과: ${rows[matchIndex].name} · ${matchIndex + 1}위`;
}

function clearRankingHighlights() {
  document.querySelectorAll("#rankingTableBody tr").forEach((tr) => {
    tr.classList.remove("is-target");
  });
}

function resetSearchStatus() {
  const status = document.getElementById("rankingSearchStatus");
  const input = document.getElementById("rankingSearchInput");
  if (status) status.textContent = "검색 시 해당 순위 위치로 이동합니다.";
  if (input) input.value = "";
  clearRankingHighlights();
}

function updateRankingSidebar(label, count) {
  const metric = document.getElementById("rankingMetricLabel");
  const api = document.getElementById("rankingApiText");
  const countLabel = document.getElementById("rankingCountLabel");

  if (metric) metric.textContent = label;
  if (countLabel) countLabel.textContent = `${formatNumber(count)}명`;
  if (api) api.textContent = appState.source === "api" ? "실시간 반영" : "fallback 반영";
}

function getMetricLabel(tab) {
  if (tab === "level") return "레벨";
  if (tab === "popularity") return "인기도";
  return "전투력";
}

function openRankingMemberModal(member) {
  const modal = document.getElementById("rankingMemberDetailModal");
  const title = document.getElementById("rankingMemberModalTitle");
  const meta = document.getElementById("rankingMemberModalMeta");
  const weekly = document.getElementById("rankingMemberModalWeeklyGrid");
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
    <div class="modal-member-stat">
      <span>주간 성장률</span>
      <strong>${escapeHtml(member.weekly?.growthRateText || "0%")}</strong>
    </div>
  `;

  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeRankingMemberModal() {
  const modal = document.getElementById("rankingMemberDetailModal");
  if (!modal) return;
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function setupRankingModalClose() {
  const closeBtn = document.getElementById("rankingMemberModalClose");
  const modal = document.getElementById("rankingMemberDetailModal");
  if (!modal) return;

  closeBtn?.addEventListener("click", closeRankingMemberModal);

  modal.querySelectorAll("[data-close-ranking-modal='true']").forEach((el) => {
    el.addEventListener("click", closeRankingMemberModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeRankingMemberModal();
  });
}