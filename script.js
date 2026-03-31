const siteData = {
  updatedAt: "2026-03-31 21:00",
  notices: [
    "분기별 길드 재배치 운영 예정",
    "친구넷은 여유 운영 및 신규 가입 우선 배치",
    "패밀리 전체 평균 밸런스를 기준으로 길드 운영",
    "위클리 및 전체 순위 데이터는 주기적으로 갱신 예정",
    "전체 순위 나래비는 패밀리 통합 기준으로 제공"
  ],
  guildDescriptions: [
    {
      name: "친구들",
      desc: "패밀리 대표 길드. 상위권 중심 운영 및 핵심 경쟁력 유지 역할을 담당합니다.",
      badge: "MAIN"
    },
    {
      name: "친구둘",
      desc: "높은 평균 전투력과 안정적인 인원 구성을 기반으로 메인 전력을 보조합니다.",
      badge: "CORE"
    },
    {
      name: "친구삼",
      desc: "친구둘과 함께 패밀리 중추 밸런스를 담당하며 성장 구간 핵심 길드 역할을 수행합니다.",
      badge: "BALANCE"
    },
    {
      name: "친구넷",
      desc: "여유 운영 및 신규 유입 중심의 길드로, 향후 성장 확장 거점 역할을 담당합니다.",
      badge: "GROWTH"
    },
    {
      name: "친구닷",
      desc: "패밀리 확장 구조를 위한 준비 길드로, 장기적 성장과 운영 확장을 고려한 포지션입니다.",
      badge: "NEXT"
    }
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
      { rank: 5, name: "정어l겐", guild: "친구삼", value: "+6" },
      { rank: 6, name: "시크릿성", guild: "친구넷", value: "+5" },
      { rank: 7, name: "퍼푸치노", guild: "친구둘", value: "+5" }
    ],
    powerTop: [
      { rank: 1, name: "제트", guild: "친구들", value: "+1,240억" },
      { rank: 2, name: "냥미011", guild: "친구삼", value: "+1,010억" },
      { rank: 3, name: "퍼푸치노", guild: "친구둘", value: "+980억" },
      { rank: 4, name: "시크릿성", guild: "친구넷", value: "+820억" },
      { rank: 5, name: "앙무", guild: "친구둘", value: "+770억" },
      { rank: 6, name: "강테토", guild: "친구삼", value: "+740억" },
      { rank: 7, name: "이나북", guild: "친구둘", value: "+705억" }
    ],
    popularityTop: [
      { rank: 1, name: "이나북", guild: "친구둘", value: "+43" },
      { rank: 2, name: "제트", guild: "친구들", value: "+38" },
      { rank: 3, name: "강테토", guild: "친구삼", value: "+31" },
      { rank: 4, name: "시크릿성", guild: "친구넷", value: "+28" },
      { rank: 5, name: "정어l겐", guild: "친구삼", value: "+24" },
      { rank: 6, name: "냥미011", guild: "친구삼", value: "+21" },
      { rank: 7, name: "퍼푸치노", guild: "친구둘", value: "+19" }
    ]
  },
  ranking: [
    { name: "제트", guild: "친구들", level: 255, power: 31200, popularity: 512 },
    { name: "앙무", guild: "친구둘", level: 253, power: 28840, popularity: 488 },
    { name: "이나북", guild: "친구둘", level: 252, power: 27610, popularity: 471 },
    { name: "냥미011", guild: "친구삼", level: 251, power: 25540, popularity: 455 },
    { name: "강테토", guild: "친구삼", level: 250, power: 24900, popularity: 449 },
    { name: "정어l겐", guild: "친구삼", level: 250, power: 24120, popularity: 443 },
    { name: "퍼푸치노", guild: "친구둘", level: 249, power: 23660, popularity: 430 },
    { name: "시크릿성", guild: "친구넷", level: 248, power: 21980, popularity: 415 },
    { name: "앙두부", guild: "친구들", level: 247, power: 21540, popularity: 402 },
    { name: "구름별", guild: "친구넷", level: 246, power: 20890, popularity: 396 },
    { name: "루나별", guild: "친구닷", level: 245, power: 19450, popularity: 381 },
    { name: "은하수", guild: "친구닷", level: 244, power: 18870, popularity: 374 },
    { name: "하늘빛", guild: "친구들", level: 243, power: 18030, popularity: 362 },
    { name: "달노래", guild: "친구삼", level: 242, power: 17680, popularity: 355 },
    { name: "라이트문", guild: "친구둘", level: 241, power: 17120, popularity: 349 }
  ]
};

let currentSort = "power";

document.addEventListener("DOMContentLoaded", () => {
  renderSummary();
  renderNotices();
  renderGuildCards();
  renderDashboardCards();
  renderGuildTable();
  renderHighlights();
  renderWeekly();
  renderRanking(currentSort);
  bindSortButtons();
});

function renderSummary() {
  const totalMembers = siteData.guilds.reduce((sum, guild) => sum + guild.members, 0);
  const avgPower = Math.round(
    siteData.guilds.reduce((sum, guild) => sum + guild.avgPower, 0) / siteData.guilds.length
  );
  const avgLevel = (
    siteData.guilds.reduce((sum, guild) => sum + guild.avgLevel, 0) / siteData.guilds.length
  ).toFixed(1);

  document.getElementById("summary-total-members").textContent = `${formatNumber(totalMembers)}명`;
  document.getElementById("summary-avg-power").textContent = `${formatNumber(avgPower)}억`;
  document.getElementById("summary-avg-level").textContent = avgLevel;
  document.getElementById("summary-updated-at").textContent = siteData.updatedAt;
}

function renderNotices() {
  const container = document.getElementById("notice-list");
  container.innerHTML = siteData.notices
    .map((notice) => `<div class="notice-item">${notice}</div>`)
    .join("");
}

function renderGuildCards() {
  const container = document.getElementById("guild-card-list");
  container.innerHTML = siteData.guildDescriptions
    .map(
      (guild) => `
        <div class="guild-card">
          <div class="guild-thumb">
            <span class="guild-thumb-badge">${guild.badge}</span>
          </div>
          <div class="guild-body">
            <h3>${guild.name}</h3>
            <p>${guild.desc}</p>
          </div>
        </div>
      `
    )
    .join("");
}

function renderDashboardCards() {
  const totalMembers = siteData.guilds.reduce((sum, guild) => sum + guild.members, 0);
  const highestPowerGuild = [...siteData.guilds].sort((a, b) => b.avgPower - a.avgPower)[0];
  const highestLevelGuild = [...siteData.guilds].sort((a, b) => b.avgLevel - a.avgLevel)[0];
  const bestGrowthGuild = [...siteData.guilds].sort((a, b) => b.growth - a.growth)[0];

  const cards = [
    { label: "전체 인원", value: `${formatNumber(totalMembers)}명` },
    { label: "최고 평균 전투력 길드", value: highestPowerGuild.name },
    { label: "최고 평균 레벨 길드", value: highestLevelGuild.name },
    { label: "최고 성장률 길드", value: bestGrowthGuild.name }
  ];

  document.getElementById("dashboard-top-cards").innerHTML = cards
    .map(
      (card) => `
        <div class="top-card">
          <span>${card.label}</span>
          <strong>${card.value}</strong>
        </div>
      `
    )
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
            <span class="guild-meta">${guild.short}</span>
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

function renderHighlights() {
  const totalMembers = siteData.guilds.reduce((sum, guild) => sum + guild.members, 0);
  const topGuildPower = [...siteData.guilds].sort((a, b) => b.avgPower - a.avgPower)[0].avgPower;
  const avgLevel = (
    siteData.guilds.reduce((sum, guild) => sum + guild.avgLevel, 0) / siteData.guilds.length
  ).toFixed(1);
  const bestGrowth = [...siteData.guilds].sort((a, b) => b.growth - a.growth)[0].growth;

  document.getElementById("highlight-total-members").textContent = `${formatNumber(totalMembers)}명`;
  document.getElementById("highlight-top-guild-power").textContent = `${formatNumber(topGuildPower)}억`;
  document.getElementById("highlight-avg-level").textContent = avgLevel;
  document.getElementById("highlight-best-growth").textContent = `+${bestGrowth}%`;
}

function renderWeekly() {
  renderRankList("weekly-level-list", siteData.weekly.levelTop);
  renderRankList("weekly-power-list", siteData.weekly.powerTop);
  renderRankList("weekly-popularity-list", siteData.weekly.popularityTop);
}

function renderRankList(targetId, items) {
  const container = document.getElementById(targetId);
  container.innerHTML = items
    .map(
      (item) => `
        <div class="rank-item">
          <div class="rank-left">
            <div class="rank-number">${item.rank}</div>
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

function renderRanking(sortKey) {
  const tbody = document.getElementById("ranking-body");
  const sorted = [...siteData.ranking].sort((a, b) => b[sortKey] - a[sortKey]);

  tbody.innerHTML = sorted
    .map(
      (member, index) => `
        <tr>
          <td><span class="rank-badge">${index + 1}</span></td>
          <td>${member.name}</td>
          <td>${member.guild}</td>
          <td>${member.level}</td>
          <td>${formatNumber(member.power)}억</td>
          <td>${member.popularity}</td>
        </tr>
      `
    )
    .join("");
}

function bindSortButtons() {
  const buttons = document.querySelectorAll(".sort-btn");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      currentSort = button.dataset.sort;
      renderRanking(currentSort);
    });
  });
}

function formatNumber(value) {
  return new Intl.NumberFormat("ko-KR").format(value);
}