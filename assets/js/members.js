document.addEventListener("DOMContentLoaded", async () => {
  renderShell();
  renderLoading("members-page", "인원·성장 데이터를 불러오는 중...");

  try {
    const [homeData, weeklyData] = await Promise.all([getHomeData(), getWeeklyData()]);
    const members = Array.isArray(homeData?.members) ? homeData.members : [];
    const weeklyMembers = Array.isArray(weeklyData?.members) ? weeklyData.members : [];
    const weeklyMap = new Map(weeklyMembers.map((m) => [m.name, m]));
    const merged = members.map((m) => ({ ...m, weeklyData: weeklyMap.get(m.name) || null }));
    const root = document.getElementById("members-page");
    root.innerHTML = renderMembersPage(merged, weeklyData?.weeklyBaseAt || null);
  } catch (error) {
    console.error(error);
    renderError("members-page", error);
  }
});

function renderMembersPage(rows, weeklyBaseAt) {
  if (!rows.length) return createEmptyBox("인원 데이터가 없습니다.");
  return `
    <div class="panel table-panel">
      <div class="panel-head">
        <div>
          <h1 class="panel-title">인원·성장</h1>
          <p class="panel-subtitle">주간 기준 ${escapeHtml(formatDateTime(weeklyBaseAt))}</p>
        </div>
      </div>
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th class="col-character">캐릭터</th>
              <th class="col-guild">길드</th>
              <th class="col-center">Lv</th>
              <th class="col-power">현재 전투력</th>
              <th class="col-center">전투력 증감</th>
              <th class="col-center">성장률</th>
              <th class="col-center">레벨 증감</th>
              <th class="col-center">인기도 증감</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map((item) => `
              <tr>
                <td class="col-character">
                  <div class="character-cell">
                    ${characterAvatarHtml(item)}
                    <div class="character-main">
                      <div class="character-name-row"><span class="character-name">${escapeHtml(item.name || "-")}</span></div>
                      <div class="character-sub">
                        <span class="server">서버 ${escapeHtml(formatNumber(item.serverRank || 0))}위</span>
                        <span>전체 ${escapeHtml(formatNumber(item.overallRank || 0))}위</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="col-guild">${guildBadgeHtml(item.guild || "길드 없음")}</td>
                <td class="col-center">${escapeHtml(formatNumber(item.level || 0))}</td>
                <td class="col-power" title="${escapeHtml(item.powerText || "-")}">${escapeHtml(item.powerText || "-")}</td>
                <td class="col-center">${metricHtml(item.weekly?.powerDiffText || "0")}</td>
                <td class="col-center">${metricHtml(item.weekly?.growthRateText || "0%")}</td>
                <td class="col-center">${metricHtml(item.weekly?.levelDiffText || "0")}</td>
                <td class="col-center">${metricHtml(item.weekly?.popularityDiffText || "0")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
