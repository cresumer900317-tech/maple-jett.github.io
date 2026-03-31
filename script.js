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
      badge: "MAIN",
      tags: ["대표 길드", "핵심 전력", "상위권 중심"],
      position: "패밀리 대표 메인 길드",
      target: "상위권 중심 / 핵심 경쟁력 유지 대상",
      summary: "가장 높은 평균 지표를 기반으로 패밀리의 중심 축 역할을 수행하며, 전체 분위기와 기준점을 이끄는 대표 길드입니다.",
      keywords: "대표성, 상위권 유지, 핵심 경쟁력, 기준점 역할"
    },
    {
      name: "친구둘",
      desc: "높은 평균 전투력과 안정적인 인원 구성을 기반으로 메인 전력을 보조합니다.",
      badge: "CORE",
      tags: ["안정 운영", "메인 보조", "중심 전력"],
      position: "메인 전력 보조 길드",
      target: "안정적 성장과 중상위권 유지 대상",
      summary: "친구들과 함께 패밀리 상단을 받쳐주는 길드로, 전반적인 안정성과 평균 지표를 균형 있게 유지하는 역할을 맡습니다.",
      keywords: "안정성, 중상위권, 전력 보조, 평균 유지"
    },
    {
      name: "친구삼",
      desc: "친구둘과 함께 패밀리 중추 밸런스를 담당하며 성장 구간 핵심 길드 역할을 수행합니다.",
      badge: "BALANCE",
      tags: ["중추 밸런스", "성장 구간", "핵심 라인"],
      position: "패밀리 중추 밸런스 길드",
      target: "성장 구간 핵심 멤버 / 균형 운영 대상",
      summary: "패밀리 전체 밸런스를 유지하는 데 중요한 역할을 하며, 성장 중인 인원과 중간층의 전력을 자연스럽게 연결합니다.",
      keywords: "밸런스, 중추 라인, 성장 연결, 안정 성장"
    },
    {
      name: "친구넷",
      desc: "여유 운영 및 신규 유입 중심의 길드로, 향후 성장 확장 거점 역할을 담당합니다.",
      badge: "GROWTH",
      tags: ["신규 유입", "확장 거점", "성장형"],
      position: "신규 유입 및 성장형 길드",
      target: "신규 멤버 / 성장 여지가 큰 대상",
      summary: "새로운 유입을 자연스럽게 받아들이고 성장 기반을 만들어주는 길드로, 패밀리 확장의 거점 역할을 맡습니다.",
      keywords: "유입, 적응, 성장 거점, 확장 기반"
    },
    {
      name: "친구닷",
      desc: "패밀리 확장 구조를 위한 준비 길드로, 장기적 성장과 운영 확장을 고려한 포지션입니다.",
      badge: "NEXT",
      tags: ["확장 준비", "장기 운영", "미래 포지션"],
      position: "확장 대비 준비 길드",
      target: "장기 운영 / 확장 구조 대비 대상",
      summary: "즉시 경쟁보다 장기적인 운영 구조와 확장을 고려한 준비형 길드로, 미래 패밀리 운영의 여유를 확보하는 데 의미가 있습니다.",
      keywords: "장기성, 확장 준비, 운영 여유, 미래 포지션"
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
  bindGuildModal();
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
    .map((guild, index) => {
      const tags = guild.tags.map((tag) => `<span>${tag}</span>`).join("");

      return `
        <div class="guild-card" data-guild-index="${index}" tabindex="0" role="button" aria-label="${guild.name} 상세보기">
          <div class="guild-character">
            <span class="guild-badge">${guild.badge}</span>
            <div class="guild-avatar">
              <div class="guild-avatar-cape"></div>
              <div class="guild-avatar-head"></div>
              <div class="guild-avatar-hair"></div>
              <div class="guild-avatar-body"></div>
            </div>
          </div>
          <div class="guild-body">
            <h3>${guild.name}</h3>
            <p>${guild.desc}</p>
            <div class="guild-tags">${tags}</div>
          </div>
        </div>
      `;
    })
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
    .map((card) => `
      <div class="top-card">
        <span>${card.label}</span>
        <strong>${card.value}</strong>
      </div>
    `)
    .join("");
}

function renderGuildTable() {
  const tbody = document.getElementById("guild-table-body");
  tbody.innerHTML = siteData.guilds
    .map((guild) => `
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
    `)
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
    .map((item) => {
      const medalClass = getMedalClass(item.rank);

      return `
        <div class="rank-item ${medalClass ? `rank-${medalClass}` : ""}">
          <div class="rank-left">
            <div class="rank-number ${medalClass ? `rank-${medalClass}` : ""}">${item.rank}</div>
            <div>
              <div class="rank-name">${item.name}</div>
              <div class="rank-guild">${item.guild}</div>
            </div>
          </div>
          <div class="rank-value">${item.value}</div>
        </div>
      `;
    })
    .join("");
}

function renderRanking(sortKey) {
  const tbody = document.getElementById("ranking-body");
  const sorted = [...siteData.ranking].sort((a, b) => b[sortKey] - a[sortKey]);

  tbody.innerHTML = sorted
    .map((member, index) => {
      const rank = index + 1;
      const medalClass = getMedalClass(rank);

      return `
        <tr>
          <td><span class="rank-badge ${medalClass ? `rank-${medalClass}` : ""}">${rank}</span></td>
          <td>${member.name}</td>
          <td>${member.guild}</td>
          <td>${member.level}</td>
          <td>${formatNumber(member.power)}억</td>
          <td>${member.popularity}</td>
        </tr>
      `;
    })
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

function bindGuildModal() {
  const modal = document.getElementById("guild-modal");
  const closeBtn = document.getElementById("modal-close-btn");

  document.addEventListener("click", (event) => {
    const card = event.target.closest(".guild-card");
    if (card) {
      openGuildModal(Number(card.dataset.guildIndex));
      return;
    }

    if (event.target === modal) {
      closeGuildModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    const activeCard = event.target.closest(".guild-card");

    if (activeCard && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      openGuildModal(Number(activeCard.dataset.guildIndex));
    }

    if (event.key === "Escape") {
      closeGuildModal();
    }
  });

  closeBtn.addEventListener("click", closeGuildModal);
}

function openGuildModal(index) {
  const guildInfo = siteData.guildDescriptions[index];
  const guildStat = siteData.guilds.find((item) => item.name === guildInfo.name);
  const modal = document.getElementById("guild-modal");

  document.getElementById("modal-badge").textContent = guildInfo.badge;
  document.getElementById("modal-title").textContent = guildInfo.name;
  document.getElementById("modal-desc").textContent = guildInfo.desc;
  document.getElementById("modal-position").textContent = guildInfo.position;
  document.getElementById("modal-target").textContent = guildInfo.target;
  document.getElementById("modal-power").textContent = `${formatNumber(guildStat.avgPower)}억`;
  document.getElementById("modal-level").textContent = `${guildStat.avgLevel}`;
  document.getElementById("modal-members").textContent = `${guildStat.members}명`;
  document.getElementById("modal-growth").textContent = `+${guildStat.growth}%`;
  document.getElementById("modal-summary").textContent = guildInfo.summary;
  document.getElementById("modal-keywords").textContent = guildInfo.keywords;

  document.getElementById("modal-tags").innerHTML = guildInfo.tags
    .map((tag) => `<span>${tag}</span>`)
    .join("");

  renderGuildMembersPreview(guildInfo.name);

  modal.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function renderGuildMembersPreview(guildName) {
  const container = document.getElementById("modal-members-grid");
  const members = [...siteData.ranking]
    .filter((member) => member.guild === guildName)
    .sort((a, b) => b.power - a.power)
    .slice(0, 4);

  if (!members.length) {
    container.innerHTML = `<div class="member-card"><div class="member-name">데이터 없음</div></div>`;
    return;
  }

  container.innerHTML = members
    .map((member, index) => `
      <div class="member-card">
        <div class="member-rank">${index + 1}</div>
        <div class="member-name">${member.name}</div>
        <div class="member-meta">
          <span>레벨 ${member.level}</span>
          <span>전투력 ${formatNumber(member.power)}억</span>
          <span>인기 ${member.popularity}</span>
        </div>
      </div>
    `)
    .join("");
}

function closeGuildModal() {
  const modal = document.getElementById("guild-modal");
  modal.classList.remove("is-open");
  document.body.style.overflow = "";
}

function getMedalClass(rank) {
  if (rank === 1) return "gold";
  if (rank === 2) return "silver";
  if (rank === 3) return "bronze";
  return "";
}

function formatNumber(value) {
  return new Intl.NumberFormat("ko-KR").format(value);
}