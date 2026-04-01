document.addEventListener("DOMContentLoaded", async () => {
  const data = await getHomeData();

  setText("latestSnapshotAt", formatDateTimeCompact(data.meta.latestSnapshotAt));
  setText("weeklyBaseAt", formatDateTimeCompact(data.meta.weeklyBaseAt));
  setText("weekRange", (data.meta.weekRange || "-").replace(" ~ ", " ~ "));

  renderApiStatus();
  renderSummary(data.summary);
  renderGuildSummary(data.guilds || [], data.members || []);
  renderHomeRankingPreview(data.rankings.power || []);
  renderNoticeCompact(await getNoticePosts());
  setupGuildModalClose();
});

function renderApiStatus() {
  const badge = document.getElementById("apiStatus");
  if (!badge) return;

  badge.className = "status-badge";
  if (appState.source === "api") {
    badge.classList.add("is-ok");
    badge.textContent = "LIVE";
  } else {
    badge.classList.add("is-fallback");
    badge.textContent = "FALLBACK";
  }
}

function renderSummary(summary) {
  const root = document.getElementById("summaryCards");
  if (!root) return;

  const cards = [
    ["총 인원", formatNumber(summary.memberCount)],
    ["평균 레벨", formatDecimal(summary.avgLevel)],
    ["평균 전투력", summary.avgPowerText || "0"],
    ["평균 인기도", formatDecimal(summary.avgPopularity)]
  ];

  root.innerHTML = cards.map(([label, value]) => `
    <article class="summary-card">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </article>
  `).join("");
}

function renderNoticeCompact(posts) {
  const root = document.getElementById("homeNoticeCompact");
  if (!root) return;

  const items = posts.slice(0, 3);
  if (!items.length) {
    root.innerHTML = `<div class="empty-state">공지 데이터가 없습니다.</div>`;
    return;
  }

  root.innerHTML = items.map((post) => `
    <article class="notice-compact-item">
      <div class="notice-compact-top">
        <span class="notice-compact-badge">${escapeHtml(post.category || "공지")}</span>
        <span class="notice-compact-date">${escapeHtml(formatDateOnly(post.createdAt))}</span>
      </div>
      <div class="notice-compact-title">${escapeHtml(post.title || "-")}</div>
    </article>
  `).join("");
}

function renderHomeRankingPreview(rows) {
  const tbody = document.getElementById("homeRankingPreviewBody");
  if (!tbody) return;

  const preview = rows.slice(0, 30);
  if (!preview.length) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state">랭킹 데이터가 없습니다.</div></td></tr>`;
    return;
  }

  tbody.innerHTML = preview.map((row) => `
    <tr>
      <td><span class="rank-badge ${getRankBadgeClass(row.rank)}">${escapeHtml(String(row.rank ?? "-"))}</span></td>
      <td><div class="name-cell"><span class="name-main">${escapeHtml(row.name || "-")}</span></div></td>
      <td><span class="guild-pill ${getGuildClass(row.guild)}">${escapeHtml(row.guild || "길드 없음")}</span></td>
      <td>${formatNumber(row.level)}</td>
      <td>${escapeHtml(row.powerText || "0")}</td>
    </tr>
  `).join("");
}

function renderGuildSummary(guilds, members) {
  const root = document.getElementById("guildGrid");
  if (!root) return;

  const visibleGuilds = guilds.filter((g) => String(g.guild || "") !== "길드 없음");

  if (!visibleGuilds.length) {
    root.innerHTML = `<div class="empty-state">길드 요약 데이터가 없습니다.</div>`;
    return;
  }

  root.innerHTML = visibleGuilds.map((guild) => `
    <article class="guild-summary-card ${getGuildClass(guild.guild)}" data-guild-name="${escapeHtml(guild.guild || "")}">
      <div class="guild-summary-head">
        <h3>${escapeHtml(guild.guild || "-")}</h3>
        <span class="guild-summary-tag">상세보기</span>
      </div>

      <div class="guild-summary-stats">
        <div class="stat-tile">
          <span>인원수</span>
          <strong>${formatNumber(guild.memberCount)}</strong>
        </div>
        <div class="stat-tile">
          <span>평균 레벨</span>
          <strong>${formatDecimal(guild.avgLevel)}</strong>
        </div>
        <div class="stat-tile">
          <span>평균 전투력</span>
          <strong>${escapeHtml(guild.avgPowerText || "0")}</strong>
        </div>
        <div class="stat-tile">
          <span>평균 인기도</span>
          <strong>${formatDecimal(guild.avgPopularity)}</strong>
        </div>
      </div>
    </article>
  `).join("");

  root.querySelectorAll(".guild-summary-card").forEach((card) => {
    card.addEventListener("click", () => {
      const guildName = card.dataset.guildName || "";
      openGuildModal(guildName, visibleGuilds, members);
    });
  });
}

function openGuildModal(guildName, guilds, members) {
  const modal = document.getElementById("guildDetailModal");
  const title = document.getElementById("guildModalTitle");
  const meta = document.getElementById("guildModalMeta");
  const list = document.getElementById("guildModalTopMembers");
  if (!modal || !title || !meta || !list) return;

  const guildInfo = guilds.find((g) => String(g.guild || "") === guildName);
  const guildMembers = [...members]
    .filter((m) => String(m.guild || "") === guildName)
    .sort((a, b) => Number(b.powerValue || 0) - Number(a.powerValue || 0))
    .slice(0, 3);

  title.textContent = guildName;

  meta.innerHTML = `
    <div class="modal-meta-card">
      <span>인원수</span>
      <strong>${formatNumber(guildInfo?.memberCount || 0)}</strong>
    </div>
    <div class="modal-meta-card">
      <span>평균 레벨</span>
      <strong>${formatDecimal(guildInfo?.avgLevel || 0)}</strong>
    </div>
    <div class="modal-meta-card">
      <span>평균 전투력</span>
      <strong>${escapeHtml(guildInfo?.avgPowerText || "0")}</strong>
    </div>
    <div class="modal-meta-card">
      <span>평균 인기도</span>
      <strong>${formatDecimal(guildInfo?.avgPopularity || 0)}</strong>
    </div>
  `;

  if (!guildMembers.length) {
    list.innerHTML = `<div class="empty-state">핵심 인원 데이터가 없습니다.</div>`;
  } else {
    list.innerHTML = guildMembers.map((member, index) => {
      const medalClass = getRankBadgeClass(index + 1);
      return `
        <article class="modal-member-card ${getGuildClass(guildName)}">
          <div class="modal-member-top">
            <div>
              <h4 class="modal-member-name">${escapeHtml(member.name || "-")}</h4>
              <div class="modal-member-sub">${escapeHtml(member.realGuild || guildName)}</div>
            </div>
            <span class="modal-member-rank ${medalClass}">TOP ${index + 1}</span>
          </div>

          <div class="modal-member-stats">
            <div class="modal-member-stat">
              <span>레벨</span>
              <strong>${formatNumber(member.level)}</strong>
            </div>
            <div class="modal-member-stat">
              <span>전투력</span>
              <strong>${escapeHtml(member.powerText || "0")}</strong>
            </div>
            <div class="modal-member-stat">
              <span>인기도</span>
              <strong>${formatNumber(member.popularity)}</strong>
            </div>
            <div class="modal-member-stat">
              <span>주간 성장률</span>
              <strong>${escapeHtml(member.weekly?.growthRateText || "0%")}</strong>
            </div>
          </div>
        </article>
      `;
    }).join("");
  }

  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeGuildModal() {
  const modal = document.getElementById("guildDetailModal");
  if (!modal) return;
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function setupGuildModalClose() {
  const closeBtn = document.getElementById("guildModalClose");
  const modal = document.getElementById("guildDetailModal");
  if (!modal) return;

  closeBtn?.addEventListener("click", closeGuildModal);

  modal.querySelectorAll("[data-close-modal='true']").forEach((el) => {
    el.addEventListener("click", closeGuildModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeGuildModal();
  });
}