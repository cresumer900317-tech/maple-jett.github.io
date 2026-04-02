document.addEventListener("DOMContentLoaded", async () => {
  renderShell();
  renderLoading("members-page", "길드원 데이터를 불러오는 중...");
  try {
    const rows = await getGuildsData();
    const list = Array.isArray(rows) ? rows : [];
    const tabs = ["전체", "친구들", "친구둘", "친구삼", "친구넷", "친구닷"];
    document.getElementById("members-page").innerHTML = `
      <section class="page-card">
        <div class="section-head"><div><h1 class="section-title">길드원</h1><p class="section-sub">길드 필터 + 내부 스크롤</p></div></div>
        <div class="tab-bar">${tabs.map((tab, idx) => `<button class="tab-btn ${idx === 0 ? "is-active" : ""}" data-guild-filter="${tab}" type="button">${tab}</button>`).join("")}</div>
        <div id="membersScrollPanel" class="scroll-panel members-scroll"><div id="membersCardList" class="stack-list">
          ${list.length ? list.map((item) => `
            <article class="list-card" data-guild="${escapeHtml(item.guild || "길드 없음")}">
              <div class="card-left"><div class="rank-chip">${escapeHtml(item.guildRank || "-")}</div>${characterAvatarHtml(item)}</div>
              <div class="card-main">
                <div class="card-topline">
                  <div><div class="rank-name">${escapeHtml(item.name || "-")}</div><div class="rank-subline">${guildBadgeHtml(item.guild || "길드 없음")}<span>${escapeHtml(item.job || "-")}</span><span>Lv ${escapeHtml(item.level || "-")}</span></div></div>
                  <div class="rank-power">${escapeHtml(formatCompactPower(item.powerText || "-"))}</div>
                </div>
                <div class="meta-grid four">
                  <div class="mini-stat"><span>길드 내 순위</span><strong>${escapeHtml(item.guildRank || "-")}</strong></div>
                  <div class="mini-stat"><span>서버 순위</span><strong>${item.serverRank ? `${escapeHtml(formatNumber(item.serverRank))}위` : "-"}</strong></div>
                  <div class="mini-stat"><span>인기도</span><strong>${escapeHtml(formatNumber(item.popularity || 0))}</strong></div>
                  <div class="mini-stat"><span>주간 성장</span><strong>${metricHtml(item.weeklyDiff || 0)}</strong></div>
                </div>
              </div>
            </article>
          `).join("") : createEmptyBox("길드원 데이터가 없습니다.")}
        </div></div>
      </section>`;

    const buttons = Array.from(document.querySelectorAll("[data-guild-filter]"));
    const cardList = document.getElementById("membersCardList");
    const apply = (guild) => {
      Array.from(cardList.querySelectorAll("[data-guild]"))
        .forEach((card) => { const same = guild === "전체" || card.getAttribute("data-guild") === guild; card.style.display = same ? "" : "none"; });
      buttons.forEach((btn) => btn.classList.toggle("is-active", btn.getAttribute("data-guild-filter") === guild));
    };
    buttons.forEach((btn) => btn.addEventListener("click", () => apply(btn.getAttribute("data-guild-filter"))));
    apply("전체");
  } catch (error) {
    console.error(error);
    renderError("members-page", error);
  }
});
