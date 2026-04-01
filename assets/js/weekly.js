document.addEventListener("DOMContentLoaded", async () => {
  renderShell();
  renderLoading("weekly-page", "주간 데이터를 불러오는 중...");

  try {
    const data = await getWeeklyData();
    const root = document.getElementById("weekly-page");
    root.innerHTML = renderWeeklyPage(data);
  } catch (error) {
    console.error(error);
    renderError("weekly-page", error);
  }
});

function renderWeeklyPage(data) {
  const weeklyTop = data?.weeklyTop || {};
  const members = Array.isArray(data?.members) ? data.members : [];
  return `
    <div class="page-grid">
      <div class="home-middle">
        <section class="panel section-panel">
          <div class="panel-head"><div><h1 class="panel-title">주간 전투력 TOP</h1><p class="panel-subtitle">기준 ${escapeHtml(formatDateTime(data?.weeklyBaseAt))}</p></div></div>
          ${renderWeeklyTopList(weeklyTop.power || [], 'power')}
        </section>
        <section class="panel section-panel">
          <div class="panel-head"><div><h2 class="panel-title">주간 레벨 TOP</h2><p class="panel-subtitle">레벨 상승 상위</p></div></div>
          ${renderWeeklyTopList(weeklyTop.level || [], 'level')}
        </section>
      </div>
      <section class="panel table-panel">
        <div class="panel-head"><div><h2 class="panel-title">주간 성장 상세</h2><p class="panel-subtitle">전체 멤버 주간 변화</p></div></div>
        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th class="col-character">캐릭터</th>
                <th class="col-guild">길드</th>
                <th class="col-center">현재 레벨</th>
                <th class="col-power">현재 전투력</th>
                <th class="col-center">전투력 증감</th>
                <th class="col-center">성장률</th>
                <th class="col-center">레벨 증감</th>
                <th class="col-center">인기도 증감</th>
                <th class="col-center">순위 변화</th>
              </tr>
            </thead>
            <tbody>
              ${members.map((item) => `
                <tr>
                  <td class="col-character">
                    <div class="character-cell">
                      ${characterAvatarHtml(item)}
                      <div class="character-main">
                        <div class="character-name-row"><span class="character-name">${escapeHtml(item.name || "-")}</span></div>
                        <div class="character-sub"><span class="server">서버 ${escapeHtml(formatNumber(item.serverRank || 0))}위</span></div>
                      </div>
                    </div>
                  </td>
                  <td class="col-guild">${guildBadgeHtml(item.guild || "길드 없음")}</td>
                  <td class="col-center">${escapeHtml(formatNumber(item.currentLevel || 0))}</td>
                  <td class="col-power" title="${escapeHtml(item.currentPowerText || '-')}">${escapeHtml(item.currentPowerText || '-')}</td>
                  <td class="col-center">${metricHtml(item.powerDiffText || '0')}</td>
                  <td class="col-center">${metricHtml(item.growthRateText || '0%')}</td>
                  <td class="col-center">${metricHtml(item.levelDiffText || '0')}</td>
                  <td class="col-center">${metricHtml(item.popularityDiffText || '0')}</td>
                  <td class="col-center">${rankTrendHtml(item)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `;
}

function renderWeeklyTopList(rows, type) {
  if (!Array.isArray(rows) || rows.length === 0) return createEmptyBox('데이터가 없습니다.');
  const sliced = rows.slice(0, 5);
  return `
    <div class="top-list">
      ${sliced.map((item, index) => {
        const value = type === 'power' ? item.diffText : item.diffText;
        const sub = type === 'power' ? `${item.powerText || '-'}` : `현재 ${type === 'level' ? `Lv ${item.currentLevel || 0}` : `인기도 ${item.currentPopularity || 0}`}`;
        return `
          <div class="top-item">
            <div class="top-rank">${index + 1}</div>
            <div>
              <div class="top-name">${escapeHtml(item.name || '-')}</div>
              <div class="top-sub">${guildBadgeHtml(item.guild || '길드 없음')}<span>${escapeHtml(sub)}</span></div>
            </div>
            <div class="top-value">${metricHtml(value || '0')}</div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}
