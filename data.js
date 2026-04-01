window.APP_CONFIG = {
  API_BASE_URL: "",
  NAV: [
    { path: "./index.html", label: "홈", key: "home" },
    { path: "./ranking.html", label: "전체랭킹", key: "ranking" },
    { path: "./members.html", label: "인원·성장", key: "members" },
    { path: "./notice.html", label: "공지", key: "notice" },
    { path: "./tips.html", label: "팁", key: "tips" }
  ]
};

window.DEFAULT_HOME_DATA = {
  ok: true,
  meta: { generatedAt: null, latestSnapshotAt: null, weeklyBaseAt: null, memberCount: 0, weekRange: "-" },
  summary: { memberCount: 0, avgLevel: 0, avgPowerText: "0", avgPopularity: 0, positiveGrowthMembers: { power: 0, level: 0, popularity: 0 } },
  guilds: [],
  rankings: { power: [], level: [], popularity: [] },
  weeklyTop: { power: [], level: [], popularity: [] },
  members: []
};
