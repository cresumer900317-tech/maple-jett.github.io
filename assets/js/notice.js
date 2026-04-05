// =============================================
// notice.js - 친구패밀리 공지사항 페이지
// =============================================

const NOTICES = [
  {
    id: 1,
    title: "친구패밀리 운영방식 변경 공지",
    date: "2025-04-05",
    category: "운영",
    important: true,
    emoji: "📢",
    content: [
      {
        type: "intro",
        text: "안녕하세요 🙂 \n친구패밀리 운영 방향과 시스템을 보다 효율적으로 개선하기 위해 아래와 같이 운영 방식을 변경합니다."
      },
      {
        type: "section",
        icon: "🔹",
        number: "1",
        title: "길드 인원 운영 방식 변경",
        items: [
          { label: "기존", value: "분기별 이동" },
          { label: "변경", value: "월별 이동" },
        ],
        note: "매달 마지막 주 수요일 저녁 기준 → [친구들] 길드 인원 1~30등 정렬 진행",
        bullets: [
          "친구들: 메인 길드 (핵심 길드)",
          "친구둘 / 친구삼 / 친구넷 / 친구닷: 균형 분배",
        ],
        sub: "기존처럼 1군/2군 개념이 아닌 1기 / 2기 개념 유지\n친구들은 패밀리의 중심이자 신규 유입을 유도하는 메인 길드 역할"
      },
      {
        type: "section",
        icon: "🔹",
        number: "2",
        title: "길드 레이드 훈장 운영 방식 변경",
        desc: "기존 방식은 효율이 낮다고 판단되어 아래와 같이 변경됩니다.",
        items: [
          { label: "진행 인원", value: "가을호떡 / 군보 / 낭만김갑룡 (3인 고정)" },
          { label: "운영 방식", value: "친구둘 / 친구삼 / 친구넷 / 친구닷 순회 방문 → 각 길드 인원이 최대한 훈장을 획득할 수 있도록 지원" },
        ],
        schedule: [
          { day: "수요일", time: "21:00 ~ 23:00" },
          { day: "토요일", time: "13:00 ~ 14:00" },
        ],
        bullets: [
          "주 2회 진행 (총 약 3시간)",
          "최대한 많은 인원이 혜택 받을 수 있도록 운영",
        ]
      },
      {
        type: "section",
        icon: "🔹",
        number: "3",
        title: "길드 전체 활성화 방향",
        bullets: [
          "친구둘/삼뿐만 아니라 넷/닷까지 적극 활용",
          "파티퀘스트, 길드 콘텐츠, 정보 공유 활성화",
          "전체 인원이 함께 성장하는 구조 구축",
        ]
      },
      {
        type: "section",
        icon: "🔹",
        number: "4",
        title: "4월 길드 재정렬 일정",
        highlight: "📅 4월 29일 22:00 ~ 4월 30일 09:00 사이 진행 예정"
      },
      {
        type: "section",
        icon: "🔹",
        number: "5",
        title: "길드 건물 & 공헌도 운영",
        desc: "길드 성장 강화를 위해 건물 업그레이드를 다시 활성화합니다.",
        items: [
          { label: "주간 공헌도", value: "6,000 이상" },
          { label: "운영 방식", value: "첫 주차 테스트 운영" },
        ]
      },
      {
        type: "section",
        icon: "🔹",
        number: "6",
        title: "콘텐츠 참여 관리",
        bullets: [
          "길드 콘텐츠 참여 여부 체크 예정",
          "지속적으로 미참여 시 → 별도 면담 진행",
        ]
      },
      {
        type: "outro",
        text: "이번 변경은 단순한 정렬이 아니라 👉 \"전체 인원이 같이 성장하는 구조\"를 만들기 위한 방향입니다.\n운영진도 더 좋은 환경을 만들기 위해 계속 고민하고 있으니 모두 적극적인 참여 부탁드립니다 🙏"
      }
    ]
  }
];

// ── 날짜 포맷 ──────────────────────────────
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

// ── 섹션 렌더 ──────────────────────────────
function renderSection(s) {
  let html = `<div class="notice-section">
    <div class="notice-section-title">
      <span class="section-icon">${s.icon}</span>
      <strong>${s.number}. ${s.title}</strong>
    </div>`;

  if (s.desc) html += `<p class="section-desc">${s.desc}</p>`;

  if (s.items) {
    html += `<ul class="section-table">`;
    for (const item of s.items) {
      html += `<li><span class="label">${item.label}</span><span class="value">${item.value}</span></li>`;
    }
    html += `</ul>`;
  }

  if (s.note) html += `<div class="section-note">📌 ${s.note}</div>`;

  if (s.bullets) {
    html += `<ul class="section-bullets">`;
    for (const b of s.bullets) {
      html += `<li>${b}</li>`;
    }
    html += `</ul>`;
  }

  if (s.sub) {
    html += `<div class="section-sub">※ ${s.sub.replace('\n', '<br>※ ')}</div>`;
  }

  if (s.schedule) {
    html += `<div class="section-schedule">📅 진행 시간 (예정 / 변동 가능)<ul>`;
    for (const sc of s.schedule) {
      html += `<li><span class="sched-day">${sc.day}</span><span class="sched-time">${sc.time}</span></li>`;
    }
    html += `</ul></div>`;
  }

  if (s.highlight) {
    html += `<div class="section-highlight">${s.highlight}</div>`;
  }

  html += `</div>`;
  return html;
}

// ── 공지 카드 렌더 ──────────────────────────
function renderNoticeCard(notice) {
  let bodyHtml = "";

  for (const block of notice.content) {
    if (block.type === "intro") {
      bodyHtml += `<p class="notice-intro">${block.text}</p>`;
    } else if (block.type === "section") {
      bodyHtml += renderSection(block);
    } else if (block.type === "outro") {
      bodyHtml += `<div class="notice-outro">${block.text.replace(/\n/g, "<br>")}</div>`;
    }
  }

  return `
    <div class="notice-card ${notice.important ? "notice-important" : ""}">
      <div class="notice-card-header">
        <div class="notice-header-left">
          <span class="notice-emoji">${notice.emoji}</span>
          <div>
            <div class="notice-category-badge">${notice.category}</div>
            <h2 class="notice-title">${notice.title}</h2>
          </div>
        </div>
        <div class="notice-date">📅 ${formatDate(notice.date)}</div>
      </div>
      <div class="notice-card-body">
        ${bodyHtml}
      </div>
    </div>
  `;
}

// ── 페이지 렌더 ────────────────────────────
function renderNoticePage() {
  const main = document.querySelector("main");
  if (!main) return;

  let html = `
    <div class="container" style="padding-top: 32px; padding-bottom: 48px;">
      <div class="page-header">
        <h1 class="page-title">📋 공지사항</h1>
        <p class="page-subtitle">친구패밀리 운영진의 공지를 확인하세요</p>
      </div>
      <div class="notice-list">
  `;

  for (const notice of NOTICES) {
    html += renderNoticeCard(notice);
  }

  html += `</div></div>`;
  main.innerHTML = html;
}

// ── 실행 ───────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  renderShell();
  renderNoticePage();
});