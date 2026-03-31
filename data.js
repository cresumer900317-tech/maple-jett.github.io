:root {
  --bg: #fffaf6;
  --bg-soft: #fff4ee;
  --bg-card: rgba(255, 255, 255, 0.82);
  --bg-card-strong: #ffffff;
  --line: rgba(234, 179, 147, 0.28);
  --line-strong: rgba(234, 179, 147, 0.45);
  --text: #47352f;
  --text-strong: #2f1f1a;
  --text-soft: #80655b;
  --text-dim: #aa8c80;
  --shadow: 0 18px 40px rgba(224, 182, 158, 0.22);

  --peach: #ffe6d9;
  --pink: #ffe0ef;
  --mint: #ddf8ef;
  --sky: #dff1ff;
  --lavender: #ece7ff;
  --butter: #fff2c9;

  --blue: #69a9ff;
  --green: #44c8a1;
  --yellow: #f3b83b;
  --pink-strong: #ef80b0;
  --purple: #9a88f6;

  --gold-bg: #fff0be;
  --gold-text: #b87908;
  --silver-bg: #eef3f8;
  --silver-text: #6d7d91;
  --bronze-bg: #ffe2cf;
  --bronze-text: #b3672f;

  --positive: #4aa6ff;
  --negative: #eb7f8e;
  --neutral: #9f8a82;

  --radius-xl: 30px;
  --radius-lg: 24px;
  --radius-md: 18px;
  --radius-sm: 14px;
  --container: 1280px;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: "Pretendard", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: var(--text);
  background:
    radial-gradient(circle at top left, rgba(255, 196, 196, 0.35), transparent 26%),
    radial-gradient(circle at top right, rgba(197, 226, 255, 0.35), transparent 22%),
    linear-gradient(180deg, #fffdfb 0%, #fff7f2 36%, #fffaf6 100%);
}

.bg-orb {
  position: fixed;
  border-radius: 999px;
  filter: blur(20px);
  pointer-events: none;
  z-index: -1;
  opacity: 0.5;
}

.orb-1 {
  width: 280px;
  height: 280px;
  top: 60px;
  left: -40px;
  background: rgba(255, 190, 213, 0.45);
}

.orb-2 {
  width: 240px;
  height: 240px;
  top: 180px;
  right: -30px;
  background: rgba(176, 225, 255, 0.42);
}

.orb-3 {
  width: 240px;
  height: 240px;
  bottom: 60px;
  left: 45%;
  background: rgba(194, 255, 218, 0.28);
}

.container {
  width: min(calc(100% - 32px), var(--container));
  margin: 0 auto;
}

.site-header {
  padding: 28px 0 12px;
}

.hero-shell {
  display: grid;
  grid-template-columns: 1.35fr 0.95fr;
  gap: 18px;
}

.hero-main,
.hero-status-card,
.guild-card,
.table-panel,
.weekly-card,
.member-card {
  background: var(--bg-card);
  border: 1px solid var(--line);
  box-shadow: var(--shadow);
  backdrop-filter: blur(14px);
}

.hero-main {
  border-radius: var(--radius-xl);
  padding: 34px;
  position: relative;
  overflow: hidden;
}

.hero-main::after {
  content: "";
  position: absolute;
  right: -40px;
  top: -40px;
  width: 220px;
  height: 220px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(255,255,255,0.7), transparent 65%);
}

.hero-badge-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border-radius: 999px;
  background: #fff0e8;
  color: #d97745;
  border: 1px solid rgba(238, 159, 118, 0.36);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.hero-badge.soft {
  background: #eef7ff;
  color: #6794de;
  border-color: rgba(103, 148, 222, 0.28);
}

.hero-title {
  margin: 0;
  font-size: clamp(32px, 4vw, 50px);
  line-height: 1.05;
  font-weight: 800;
  color: var(--text-strong);
}

.hero-desc {
  margin: 16px 0 0;
  max-width: 760px;
  font-size: 15px;
  line-height: 1.8;
  color: var(--text-soft);
}

.hero-info-pills {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 24px;
}

.info-pill {
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.76);
  border: 1px solid rgba(239, 195, 171, 0.38);
  padding: 16px;
}

.info-pill .label {
  display: block;
  font-size: 12px;
  color: var(--text-dim);
  margin-bottom: 8px;
}

.info-pill strong {
  display: block;
  color: var(--text-strong);
  font-size: 15px;
  line-height: 1.5;
}

.hero-status-card {
  border-radius: var(--radius-xl);
  padding: 24px;
}

.status-top {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  margin-bottom: 18px;
}

.section-mini {
  margin: 0;
  font-size: 12px;
  font-weight: 800;
  color: #e58f62;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.status-chip {
  min-width: 96px;
  height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.status-chip.is-loading {
  background: #fff3cf;
  color: #b77b00;
}

.status-chip.is-ok {
  background: #def8ee;
  color: #2f9d79;
}

.status-chip.is-fallback {
  background: #e5f2ff;
  color: #4d87cc;
}

.status-chip.is-error {
  background: #ffe0e5;
  color: #d95d70;
}

.status-card-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.summary-card {
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #fff9f5 100%);
  border: 1px solid rgba(237, 198, 174, 0.36);
  padding: 18px;
}

.summary-card span {
  display: block;
  color: var(--text-dim);
  font-size: 13px;
  margin-bottom: 10px;
}

.summary-card strong {
  font-size: 24px;
  font-weight: 800;
  color: var(--text-strong);
}

.page-content {
  padding-bottom: 56px;
}

.content-section {
  margin-top: 26px;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 16px;
  margin-bottom: 16px;
}

.section-head h2 {
  margin: 4px 0 0;
  font-size: clamp(24px, 2vw, 31px);
  color: var(--text-strong);
}

.tab-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tab-btn {
  height: 44px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid rgba(230, 181, 151, 0.45);
  background: rgba(255, 255, 255, 0.72);
  color: var(--text-soft);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
}

.tab-btn:hover,
.tab-btn.is-active {
  background: linear-gradient(180deg, #fff1e7 0%, #ffe7d6 100%);
  color: #cb6f3f;
  border-color: rgba(226, 147, 98, 0.42);
  transform: translateY(-1px);
}

.guild-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.guild-card {
  border-radius: 26px;
  padding: 22px;
  position: relative;
  overflow: hidden;
}

.guild-card::before {
  content: "";
  position: absolute;
  top: 16px;
  right: 16px;
  width: 88px;
  height: 88px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(255,255,255,0.8), transparent 65%);
}

.guild-card.is-친구들 {
  background: linear-gradient(180deg, #f7fbff 0%, #e9f5ff 100%);
}
.guild-card.is-친구둘 {
  background: linear-gradient(180deg, #f5fffb 0%, #e5fbf3 100%);
}
.guild-card.is-친구삼 {
  background: linear-gradient(180deg, #fffdf4 0%, #fff4cf 100%);
}
.guild-card.is-친구넷 {
  background: linear-gradient(180deg, #fff7fb 0%, #ffe8f3 100%);
}
.guild-card.is-친구닷 {
  background: linear-gradient(180deg, #faf8ff 0%, #efeaff 100%);
}
.guild-card.is-길드없음 {
  background: linear-gradient(180deg, #fdfdfd 0%, #f5f5f5 100%);
}

.guild-card h3 {
  margin: 0 0 14px;
  font-size: 24px;
  color: var(--text-strong);
}

.guild-stats {
  display: grid;
  gap: 10px;
}

.guild-stat-row {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  padding-bottom: 10px;
  border-bottom: 1px dashed rgba(204, 164, 139, 0.4);
}

.guild-stat-row:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.guild-stat-label {
  color: var(--text-soft);
  font-size: 14px;
}

.guild-stat-value {
  color: var(--text-strong);
  font-weight: 800;
  text-align: right;
}

.table-panel {
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.table-wrap {
  overflow-x: auto;
}

.ranking-table {
  width: 100%;
  min-width: 980px;
  border-collapse: collapse;
}

.ranking-table thead th {
  background: linear-gradient(180deg, #fff3ea 0%, #ffe8da 100%);
  color: #b46f48;
  text-align: left;
  padding: 16px 18px;
  font-size: 13px;
  font-weight: 800;
  border-bottom: 1px solid rgba(228, 174, 140, 0.45);
}

.ranking-table tbody td {
  padding: 16px 18px;
  font-size: 14px;
  color: var(--text);
  border-bottom: 1px solid rgba(234, 197, 175, 0.3);
  background: rgba(255, 255, 255, 0.5);
}

.ranking-table tbody tr:hover td {
  background: rgba(255, 247, 241, 0.95);
}

.rank-badge {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  border: 1px solid rgba(224, 182, 158, 0.38);
  background: #fff;
  color: var(--text-soft);
}

.rank-badge.is-gold {
  background: var(--gold-bg);
  color: var(--gold-text);
  border-color: rgba(224, 168, 48, 0.35);
}

.rank-badge.is-silver {
  background: var(--silver-bg);
  color: var(--silver-text);
  border-color: rgba(144, 165, 189, 0.35);
}

.rank-badge.is-bronze {
  background: var(--bronze-bg);
  color: var(--bronze-text);
  border-color: rgba(197, 129, 78, 0.35);
}

.name-cell {
  display: grid;
  gap: 4px;
}

.name-main {
  font-weight: 800;
  color: var(--text-strong);
}

.name-sub {
  color: var(--text-dim);
  font-size: 12px;
}

.guild-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
}

.guild-pill.is-친구들 {
  background: #e8f4ff;
  color: #528fd9;
}
.guild-pill.is-친구둘 {
  background: #e5fbf3;
  color: #2da783;
}
.guild-pill.is-친구삼 {
  background: #fff4cf;
  color: #c58b10;
}
.guild-pill.is-친구넷 {
  background: #ffe7f2;
  color: #d26897;
}
.guild-pill.is-친구닷 {
  background: #eee8ff;
  color: #7c67e8;
}
.guild-pill.is-길드없음 {
  background: #f1f1f1;
  color: #8f8f8f;
}

.growth-positive {
  color: var(--positive);
  font-weight: 800;
}

.growth-negative {
  color: var(--negative);
  font-weight: 800;
}

.growth-zero {
  color: var(--neutral);
  font-weight: 700;
}

.weekly-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.weekly-card {
  border-radius: 26px;
  padding: 22px;
  background: linear-gradient(180deg, #fffdfc 0%, #fff6f0 100%);
}

.weekly-card-rank {
  width: 44px;
  height: 44px;
  border-radius: 15px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #fff0e2;
  color: #d37546;
  font-weight: 800;
  margin-bottom: 14px;
}

.weekly-card h3 {
  margin: 0 0 6px;
  font-size: 24px;
  color: var(--text-strong);
}

.weekly-card .sub-text {
  color: var(--text-dim);
  font-size: 13px;
}

.weekly-card-list {
  margin-top: 14px;
}

.weekly-card-row {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  padding-top: 12px;
  border-top: 1px dashed rgba(221, 179, 152, 0.42);
}

.weekly-card-row .left {
  display: grid;
  gap: 4px;
}

.weekly-card-row .left strong {
  color: var(--text-strong);
}

.weekly-card-row .right {
  text-align: right;
  font-weight: 800;
  color: var(--text-soft);
  font-size: 13px;
}

.members-head {
  align-items: center;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.search-box input,
.select-box select {
  height: 46px;
  border-radius: 16px;
  border: 1px solid rgba(230, 181, 151, 0.4);
  background: rgba(255, 255, 255, 0.82);
  color: var(--text-strong);
  padding: 0 14px;
  font-size: 14px;
  outline: none;
  box-shadow: 0 8px 18px rgba(237, 191, 167, 0.12);
}

.search-box input {
  min-width: 240px;
}

.select-box select {
  min-width: 150px;
}

.members-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.member-card {
  border-radius: 28px;
  padding: 20px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #fffefe 0%, #fff7f2 100%);
}

.member-card::after {
  content: "";
  position: absolute;
  right: -18px;
  bottom: -18px;
  width: 110px;
  height: 110px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(255,255,255,0.75), transparent 68%);
}

.member-top {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 12px;
  margin-bottom: 16px;
}

.member-rank {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--text-dim);
  font-size: 13px;
  font-weight: 700;
}

.member-rank strong {
  color: var(--text-strong);
  font-size: 17px;
}

.member-name {
  margin: 6px 0 4px;
  font-size: 24px;
  color: var(--text-strong);
  font-weight: 800;
}

.member-real-guild {
  color: var(--text-dim);
  font-size: 13px;
}

.member-stats {
  display: grid;
  gap: 10px;
}

.member-stat {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 10px;
  border-bottom: 1px dashed rgba(214, 171, 145, 0.36);
}

.member-stat:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.member-stat-label {
  color: var(--text-soft);
  font-size: 13px;
}

.member-stat-value {
  color: var(--text-strong);
  font-weight: 800;
  text-align: right;
}

.empty-state {
  margin-top: 14px;
  border: 1px dashed rgba(224, 180, 154, 0.5);
  border-radius: 20px;
  padding: 24px;
  text-align: center;
  background: rgba(255, 255, 255, 0.7);
  color: var(--text-dim);
}

.hidden {
  display: none !important;
}

.site-footer {
  padding: 20px 0 34px;
  border-top: 1px solid rgba(232, 193, 170, 0.35);
}

.footer-inner {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: var(--text-dim);
  font-size: 13px;
}

@media (max-width: 1180px) {
  .hero-shell {
    grid-template-columns: 1fr;
  }

  .guild-grid,
  .weekly-grid,
  .members-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .container {
    width: min(calc(100% - 20px), var(--container));
  }

  .hero-info-pills,
  .status-card-grid,
  .guild-grid,
  .weekly-grid,
  .members-grid {
    grid-template-columns: 1fr;
  }

  .section-head,
  .members-head,
  .footer-inner {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar {
    flex-direction: column;
  }

  .search-box input,
  .select-box select {
    width: 100%;
  }

  .hero-main,
  .hero-status-card,
  .guild-card,
  .table-panel,
  .weekly-card,
  .member-card {
    border-radius: 22px;
  }
}