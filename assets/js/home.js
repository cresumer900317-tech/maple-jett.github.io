document.addEventListener("DOMContentLoaded", async () => {
  renderShell();

  try {
    const [summary, members] = await Promise.all([
      getHomeData(),
      getGuildsData(),
    ]);

    const rows = Array.isArray(members) ? members : [];
    const grouped = byGuild(rows);
    const guilds = ["친구들", "친구둘", "친구삼", "친구넷", "친구닷"];

    const activeServerRanks = rows
      .filter((x) => Number(x.serverRank || 0) > 0)
      .map((x) => Number(x.serverRank));
    const avgServerRank = activeServerRanks.length
      ? (activeServerRanks.reduce((a, b) => a + b, 0) / activeServerRanks.length).toFixed(1)
      : "-";
    const avgPower = rows.length
      ? Math.round(rows.reduce((sum, r) => sum + Number(r.power || 0), 0) / rows.length)
      : 0;

    const growthTop = [...rows]
      .filter((x) => Number(x.weeklyDiff || 0) > 0)
      .sort((a, b) => Number(b.weeklyDiff || 0) - Number(a.weeklyDiff || 0))
      .slice(0, 5);

    const riseTop = [...rows]
      .filter((x) => Number(x.serverRankDiff || 0) > 0)
      .sort((a, b) => Number(b.serverRankDiff || 0) - Number(a.serverRankDiff || 0))
      .slice(0, 5);

    const powerTop3 = [...rows]
      .sort((a, b) => Number(b.power || 0) - Number(a.power || 0))
      .slice(0, 3);

    const lastUpdate = rows.length && rows[0].capturedAt
      ? new Date(rows[0].capturedAt).toLocaleString("ko-KR", {
          year: "numeric", month: "2-digit", day: "2-digit",
          hour: "2-digit", minute: "2-digit",
        })
      : "-";

    const memberCount = summary.member_count || rows.length;
    const guildCount = summary.guild_count || 5;

    document.querySelector("main").innerHTML = `
      <div class="home-hero">
        <div class="container hero-inner">
          <div class="hero-badge">
            <span class="hero-dot"></span>
            메이플키우기 · 스카니아 11서버
          </div>
          <h1 class="hero-title">함께라서 <span class="accent">더 강한</span><br>친구패밀리 😊</h1>
          <p class="hero-desc">5개 길드가 함께하는 메이플키우기 패밀리 길드</p>
          <p class="hero-update">마지막 업데이트: <span class="time">${lastUpdate}</span></p>
          <a class="cta-btn" href="https://open.kakao.com/o/gagOlyni" target="_blank" rel="noopener noreferrer">가입 문의하기</a>
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-label">총 길드 수</div>
              <div class="kpi-value">${guildCount}개</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">총 인원</div>
              <div class="kpi-value dark">${formatNumber(memberCount)}명</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">평균 전투력</div>
              <div class="kpi-value">${formatCompactPower(avgPower)}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">평균 서버 순위</div>
              <div class="kpi-value dark">${avgServerRank !== "-" ? formatNumber(Number(avgServerRank)) + "위" : "-"}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="section-block">
        <div class="container">
          <div class="section-head">
            <div>
              <div class="section-title">길드별 현황</div>
              <div class="section-sub">인원 · 평균 전투력</div>
            </div>
          </div>
          <div class="family-board-grid">
            ${guilds.map((guild) => {
              const list = grouped[guild] || [];
              const avg = list.length
                ? Math.round(list.reduce((s, r) => s + Number(r.power || 0), 0) / list.length)
                : 0;
              const isActive = list.length >= 10;
              return `
                <div class="guild-board-card ${isActive ? "active" : ""}">
                  <div class="guild-board-emoji">😊</div>
                  <div class="guild-board-name">${escapeHtml(guild)}</div>
                  <div class="guild-board-stat">
                    <div class="guild-board-stat-label">인원</div>
                    <div class="guild-board-stat-val accent">${formatNumber(list.length)}명</div>
                  </div>
                  <div class="guild-board-stat">
                    <div class="guild-board-stat-label">평균 전투력</div>
                    <div class="guild-board-stat-val">${formatCompactPower(avg)}</div>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      </div>

      <div class="section-block">
        <div class="container">
          <div class="section-head">
            <div>
              <div class="section-title">패밀리 TOP 3</div>
              <div class="section-sub">전체 전투력 기준</div>
            </div>
            <a class="section-link" href="./ranking.html">전체 랭킹 보기 →</a>
          </div>
          <div class="top3-grid">
            ${powerTop3.length ? powerTop3.map((item, i) => {
              const medals = ["🥇", "🥈", "🥉"];
              const pt = item.powerText || "";
              const parts = pt.trim().split(/\s+/).filter(Boolean);
              const displayPower = parts.length >= 2 ? parts[0] + " " + parts[1] : pt || formatCompactPower(item.power);
              return `
                <div class="top-card ${i === 0 ? "gold" : ""}">
                  <div class="top-rank-icon">${medals[i]}</div>
                  <div class="top-name">${escapeHtml(item.name || "-")}</div>
                  <div class="top-power">${escapeHtml(displayPower)}</div>
                  <div class="top-meta">${escapeHtml(item.guild || "-")} · 서버 ${item.serverRank ? formatNumber(item.serverRank) + "위" : "-"}</div>
                </div>
              `;
            }).join("") : `<div class="empty-box" style="grid-column:1/-1;">데이터가 없습니다.</div>`}
          </div>
        </div>
      </div>

      <div class="section-block">
        <div class="container">
          <div class="section-head">
            <div>
              <div class="section-title">이번 주 변화</div>
              <div class="section-sub">성장량 · 서버 순위 상승 TOP 5</div>
            </div>
            <a class="section-link" href="./weekly.html">주간성장 보기 →</a>
          </div>
          <div class="summary-split">
            <div class="summary-panel">
              <div class="sub-head">성장 TOP 5</div>
              <div class="mini-card-list">
                ${growthTop.length ? growthTop.map((item, i) => `
                  <div class="mini-summary-card">
                    <span class="mini-summary-rank">${i + 1}</span>
                    ${characterAvatarHtml(item)}
                    <div class="mini-summary-main">
                      <div class="mini-summary-name">${escapeHtml(item.name || "-")}</div>
                      <div class="mini-summary-sub">
                        ${guildBadgeHtml(item.guild)}
                        <span>성장률 ${escapeHtml(formatRate(item.growthRate || 0))}</span>
                      </div>
                    </div>
                    <div class="mini-summary-side">${metricHtml(item.weeklyDiff || 0)}</div>
                  </div>
                `).join("") : `<div class="empty-box">다음 업데이트 후 표시됩니다.</div>`}
              </div>
            </div>
            <div class="summary-panel">
              <div class="sub-head">서버 순위 상승 TOP 5</div>
              <div class="mini-card-list">
                ${riseTop.length ? riseTop.map((item, i) => `
                  <div class="mini-summary-card">
                    <span class="mini-summary-rank">${i + 1}</span>
                    ${characterAvatarHtml(item)}
                    <div class="mini-summary-main">
                      <div class="mini-summary-name">${escapeHtml(item.name || "-")}</div>
                      <div class="mini-summary-sub">
                        ${guildBadgeHtml(item.guild)}
                        <span>현재 ${item.serverRank ? formatNumber(item.serverRank) + "위" : "-"}</span>
                      </div>
                    </div>
                    <div class="mini-summary-side">${rankTrendHtml(item)}</div>
                  </div>
                `).join("") : `<div class="empty-box">서버 순위 데이터 수집 후 표시됩니다.</div>`}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    console.error(error);
    document.querySelector("main").innerHTML = `
      <div class="container" style="padding-top:40px;">
        <div class="error-box">데이터를 불러오지 못했습니다: ${escapeHtml(error?.message || "오류")}</div>
      </div>
    `;
  }
});