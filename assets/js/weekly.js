document.addEventListener("DOMContentLoaded", async () => {
  renderShell();

  try {
    // /api/monthly 엔드포인트로 변경
    const API_BASE = "https://guild-backend-production-75a6.up.railway.app";
    const res = await fetch(`${API_BASE}/api/monthly`, { cache: "no-store" });
    if (!res.ok) throw new Error("월간 성장 데이터를 불러오지 못했습니다.");
    const members = await res.json();
    const rows = Array.isArray(members) ? members : [];

    // 이번 달 표시용
    const now = new Date();
    const monthLabel = `${now.getFullYear()}년 ${now.getMonth() + 1}월`;
    const hasSnapshot = rows.some(r => r.hasSnapshot);

    let currentTab = "growth";

    function getTabData() {
      if (currentTab === "growth") {
        return [...rows].sort((a, b) => Number(b.monthlyDiff || 0) - Number(a.monthlyDiff || 0));
      }
      if (currentTab === "rate") {
        return [...rows].sort((a, b) => Number(b.growthRate || 0) - Number(a.growthRate || 0));
      }
      if (currentTab === "server") {
        return [...rows]
          .filter((x) => Number(x.serverRankDiff || 0) > 0)
          .sort((a, b) => Number(b.serverRankDiff || 0) - Number(a.serverRankDiff || 0));
      }
      return rows;
    }

    function renderCards(list) {
      if (!list.length) return createEmptyBox("데이터가 없습니다.");

      return list.map((item, idx) => {
        const rank = idx + 1;
        const pt = item.powerText || "";
        const parts = pt.trim().split(/\s+/).filter(Boolean);
        const displayPower = parts.length >= 2 ? parts[0] + " " + parts[1] : pt || formatCompactPower(item.power);

        // 월간 성장량 표시
        const monthlyDiff = item.monthlyDiff;
        let diffHtml = "-";
        if (!item.hasSnapshot) {
          diffHtml = `<span style="color:var(--text-faint);font-size:0.78rem;">기준 없음</span>`;
        } else if (monthlyDiff !== null && monthlyDiff !== undefined) {
          diffHtml = metricHtml(monthlyDiff);
        }

        // 성장률
        const growthRateHtml = item.growthRate !== null && item.growthRate !== undefined
          ? formatRate(item.growthRate)
          : (item.hasSnapshot ? "0.00%" : "-");

        return `
          <article class="list-card">
            <div class="card-left">
              ${rank <= 3
                ? `<div class="rank-chip ${rank === 1 ? "medal-gold" : rank === 2 ? "medal-silver" : "medal-bronze"}">${rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}</div>`
                : `<div class="rank-chip rank-default">${rank}</div>`
              }
              ${characterAvatarHtml(item)}
            </div>
            <div class="card-main">
              <div class="card-topline">
                <div>
                  <div class="rank-name">${escapeHtml(item.name || "-")}</div>
                  <div class="rank-subline">
                    ${guildBadgeHtml(item.guild || "길드 없음")}
                    <span class="job-text">${escapeHtml(item.job || "-")}</span>
                    <span class="level-text">Lv ${escapeHtml(String(item.level || "-"))}</span>
                  </div>
                </div>
                <div class="rank-power">${escapeHtml(displayPower)}</div>
              </div>
              <div class="meta-grid four">
                <div class="mini-stat"><span>월간 성장량</span><strong>${diffHtml}</strong></div>
                <div class="mini-stat"><span>성장률</span><strong>${growthRateHtml}</strong></div>
                <div class="mini-stat"><span>서버 변동</span><strong>${rankTrendHtml(item)}</strong></div>
                <div class="mini-stat"><span>현재 서버 순위</span><strong>${item.serverRank ? formatNumber(item.serverRank) + "위" : "-"}</strong></div>
              </div>
            </div>
          </article>
        `;
      }).join("");
    }

    // 스냅샷 없을 때 안내 배너
    const snapshotBanner = !hasSnapshot ? `
      <div style="
        background: var(--yellow-bg);
        border: 1px solid var(--yellow-border);
        border-radius: var(--radius-md);
        padding: 12px 16px;
        font-size: 0.85rem;
        color: var(--amber-dark);
        margin-bottom: 16px;
      ">
        📌 매달 1일에 기준 전투력이 저장됩니다. 스냅샷이 생성된 이후부터 월간 성장량이 표시됩니다.
      </div>
    ` : "";

    document.querySelector("main").innerHTML = `
      <div class="page-card">
        <div class="container">
          <div class="section-head">
            <div>
              <div class="section-title">📈 월간 성장 <span style="font-size:0.8rem;font-weight:400;color:var(--text-faint);margin-left:6px;">${monthLabel}</span></div>
              <div class="section-sub">성장량 / 성장률 / 서버 순위 상승 기준 전환</div>
            </div>
          </div>
          ${snapshotBanner}
          <div class="tab-bar">
            <button class="tab-btn is-active" data-tab="growth">성장량</button>
            <button class="tab-btn" data-tab="rate">성장률</button>
            <button class="tab-btn" data-tab="server">서버 상승</button>
          </div>
          <div class="stack-list" id="weeklyList">
            <div class="loading-box">불러오는 중...</div>
          </div>
        </div>
      </div>
    `;

    function render() {
      const list = getTabData();
      document.getElementById("weeklyList").innerHTML = renderCards(list);
      document.querySelectorAll(".tab-btn").forEach((btn) => {
        btn.classList.toggle("is-active", btn.dataset.tab === currentTab);
      });
    }

    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentTab = btn.dataset.tab;
        render();
      });
    });

    render();

  } catch (error) {
    console.error(error);
    document.querySelector("main").innerHTML = `
      <div class="container" style="padding-top:40px;">
        <div class="error-box">데이터를 불러오지 못했습니다: ${escapeHtml(error?.message || "오류")}</div>
      </div>
    `;
  }
});