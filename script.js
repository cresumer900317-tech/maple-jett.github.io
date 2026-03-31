const siteData = {
  lastUpdated: "2026-03-31 21:00",
  summary: {
    totalMembers: 146,
    avgPower: 88311,
    avgLevel: 241.7
  },
  notices: [
    "분기별 길드 재배치 운영",
    "친구넷은 여유 운영 / 신규 가입 우선 배치",
    "대시보드 및 위클리는 주기적으로 업데이트"
  ],
  guilds: [
    { name: "친구들", short: "1기", members: 30, avgPower: 112300, avgLevel: 248.2, growth: 6.8 },
    { name: "친구둘", short: "2기", members: 29, avgPower: 90500, avgLevel: 243.9, growth: 5.2 },
    { name: "친구삼", short: "3기", members: 29, avgPower: 89200, avgLevel: 242.8, growth: 5.0 },
    { name: "친구넷", short: "4기", members: 29, avgPower: 70100, avgLevel: 235.4, growth: 3.6 },
    { name: "친구닷", short: "5기", members: 29, avgPower: 58300, avgLevel: 229.7, growth: 4.1 }
  ],
  weekly: {
    levelTop: [
      { rank: 1, name: "제트", guild: "친구들", value: "+9" },
      { rank: 2, name: "앙무", guild: "친구둘", value: "+8" },
      { rank: 3, name: "이나북", guild: "친구둘", value: "+7" },
      { rank: 4, name: "강테토", guild: "친구삼", value: "+6" },
      { rank: 5, name: "정어l겐", guild: "친구삼", value: "+6" }
    ],
    powerTop: [
      { rank: 1, name: "제트", guild: "친구들", value: "+1,240억" },
      { rank: 2, name: "냥미011", guild: "친구삼", value: "+1,010억" },
      { rank: 3, name: "퍼푸치노", guild: "친구둘", value: "+980억" },
      { rank: 4, name: "시크릿성", guild: "친구넷", value: "+820억" },
      { rank: 5, name: "앙무", guild: "친구둘", value: "+770억" }
    ],
    popularityTop: [
      { rank: 1, name: "이나북", guild: "친구둘", value: "+43" },
      { rank: 2, name: "제트", guild: "친구들", value: "+38" },
      { rank: 3, name: "강테토", guild: "친구삼", value: "+31" },
      { rank: 4, name: "시크릿성", guild: "친구넷", value: "+28" },
      { rank: 5, name: "정어l겐", guild: "친구삼", value: "+24" }
    ]
  },
  familyRanking: [
    { name: "제트", guild: "친구들", level: 255, power: 31200, popularity: 512 },
    { name: "앙무", guild: "친구둘", level: 253, power: 28840, popularity: 488 },
    { name: "이나북", guild: "친구둘", level: 252, power: 27610, popularity: 471 },
    { name: "냥미011", guild: "친구삼", level: 251, power: 25540, popularity: 455 },
    { name: "강테토", guild: "친구삼", level: 250, power: 24900, popularity: 449 },
    { name: "정어l겐", guild: "친구삼", level: 250, power: 24120, popularity: 443 },
    { name: "퍼푸치노", guild: "친구둘", level: 249, power: 23660, popularity: 430 },
    { name: "시크릿성", guild: "친구넷", level: 248, power: 21980, popularity: 415 }
  ]
};

let currentSort = "power";

document.addEventListener("DOMContentLoaded", () => {
  renderSummary();
  renderNotices();
  renderGuildTable();
  renderWeeklyLists();
  renderFamilyRanking(currentSort);
  renderJsonPreview();
  bindSortButtons();
});

function renderSummary() {
  document.getElementById("stat-total-members").textContent = `${siteData.summary.totalMembers}명`;
  document.getElementById("stat-avg-power").textContent = `${formatNumber(siteData.summary.avgPower)}억`;
  document.getElementById("stat-avg-level").textContent = `${siteData.summary.avgLevel}`;
  document.getElementById("stat-updated").textContent = siteData.lastUpdated;
}

function renderNotices() {
  const container = document.getElementById("notice-list");
  container.innerHTML = siteData.notices
    .map((notice) => `<div class="notice-item">${notice}</div>`)
    .join("");
}

function renderGuildTable() {
  const tbody = document.getElementById("guild-table-body");
  tbody.innerHTML = siteData.guilds
    .map(
      (guild) => `
        <tr>
          <td>
            <span class="guild-name">${guild.name}</span>
            <span class="guild-sub">${guild.short}</span>
          </td>
          <td>${guild.members}명</td>
          <td>${formatNumber(guild.avgPower)}억</td>
          <td>${guild.avgLevel}</td>
          <td><span class="growth-badge">+${guild.growth}%</span></td>
        </tr>
      `
    )
    .join("");
}

function renderWeeklyLists() {
  renderRankList("level-top-list", siteData.weekly.levelTop);
  renderRankList("power-top-list", siteData.weekly.powerTop);
  renderRankList("popularity-top-list", siteData.weekly.popularityTop);
}

function renderRankList(targetId, items) {
  const container = document.getElementById(targetId);

  container.innerHTML = items
    .map(
      (item) => `
        <div class="rank-item">
          <div class="rank-left">
            <div class="rank-num">${item.rank}</div>
            <div>
              <div class="rank-name">${item.name}</div>
              <div class="rank-guild">${item.guild}</div>
            </div>
          </div>
          <div class="rank-value">${item.value}</div>
        </div>
      `
    )
    .join("");
}

function renderFamilyRanking(sortKey) {
  const tbody = document.getElementById("family-ranking-body");

  const sorted = [...siteData.familyRanking].sort((a, b) => b[sortKey] - a[sortKey]);

  tbody.innerHTML = sorted
    .map(
      (member, index) => `
        <tr>
          <td><span class="rank-badge">${index + 1}</span></td>
          <td>${member.name}</td>
          <td>${member.guild}</td>
          <td>${member.level}</td>
          <td>${formatPower(member.power)}</td>
          <td>${member.popularity}</td>
        </tr>
      `
    )
    .join("");
}

function bindSortButtons() {
  const buttons = document.querySelectorAll(".toolbar-btn");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      currentSort = button.dataset.sort;
      renderFamilyRanking(currentSort);
    });
  });
}

function renderJsonPreview() {
  const previewData = {
    lastUpdated: siteData.lastUpdated,
    summary: siteData.summary,
    guilds: siteData.guilds,
    weekly: siteData.weekly,
    familyRanking: siteData.familyRanking
  };

  document.getElementById("json-preview").textContent = JSON.stringify(previewData, null, 2);
}

function formatNumber(value) {
  return new Intl.NumberFormat("ko-KR").format(value);
}

function formatPower(value) {
  return `${formatNumber(value)}억`;
}