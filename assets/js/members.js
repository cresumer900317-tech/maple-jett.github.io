document.addEventListener("DOMContentLoaded", async () => {
  if (typeof renderShell === "function") renderShell();
  if (typeof renderLoading === "function") {
    renderLoading("members-page", "인원 데이터를 불러오는 중...");
  } else {
    const root = document.getElementById("members-page");
    if (root) root.innerHTML = '<div class="panel"><p>인원 데이터를 불러오는 중...</p></div>';
  }

  try {
    const [members, weekly] = await Promise.all([
      fetchLocalJson("./data/members.json"),
      fetchLocalJson("./data/weekly.json").catch(() => [])
    ]);

    const weeklyMap = new Map(
      (Array.isArray(weekly) ? weekly : []).map((item) => [String(item.name || ""), item])
    );

    const merged = (Array.isArray(members) ? members : []).map((item, index) => {
      const weeklyItem = weeklyMap.get(String(item.name || "")) || null;
      return {
        ...item,
        rank: toNumber(item.rank, index + 1),
        serverRank: toNumber(item.serverRank, item.rank || index + 1),
        level: toNumber(item.level, 0),
        popularity: toNumber(item.popularity, 0),
        power: toNumber(item.power, 0),
        powerText: item.powerText || formatNumber(toNumber(item.power, 0)),
        weekly_diff: toNumber(item.weekly_diff, weeklyItem?.weekly_diff || 0),
        weeklyData: weeklyItem
      };
    });

    const root = document.getElementById("members-page");
    if (!root) return;
    root.innerHTML = renderMembersPage(merged);
    bindMembersEvents(merged);
  } catch (error) {
    console.error(error);
    if (typeof renderError === "function") {
      renderError("members-page", error);
    } else {
      const root = document.getElementById("members-page");
      if (root) root.innerHTML = `<div class="panel"><p>데이터를 불러오지 못했습니다.</p><pre>${escapeHtml(String(error.message || error))}</pre></div>`;
    }
  }
});

async function fetchLocalJson(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`${path} 파일을 불러오지 못했습니다. (${response.status})`);
  }
  return response.json();
}

function renderMembersPage(rows) {
  return `
    <div class="panel table-panel">
      <div class="panel-head">
        <div>
          <h1 class="panel-title">인원·성장</h1>
          <p class="panel-subtitle">현재 멤버 정보와 주간 성장 수치를 한 번에 확인</p>
        </div>
      </div>

      <div class="table-toolbar">
        <div class="value-soft">총 ${escapeHtml(formatNumber(rows.length))}명</div>
        <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
          <label class="search-box">
            <span>🔎</span>
            <input id="membersSearchInput" type="text" placeholder="캐릭터명 검색" autocomplete="off" />
          </label>
          <button id="membersResetButton" class="detail-btn" type="button">초기화</button>
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
              <th class="col-center">주간 전투력 증감</th>
              <th class="col-center">주간 성장률</th>
              <th class="col-center">서버 순위</th>
              <th class="col-center">인기도</th>
            </tr>
          </thead>
          <tbody id="membersTableBody">
            ${renderMemberRows(rows)}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderMemberRows(rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return `
      <tr>
        <td colspan="8">${emptyBox("멤버 데이터가 없습니다.")}</td>
      </tr>
    `;
  }

  return rows.map((item) => {
    const weeklyDiff = toNumber(item.weekly_diff, 0);
    const growthRate = calculateGrowthRate(item.power, weeklyDiff);

    return `
      <tr data-character-row="${escapeHtml(String(item.name || "").toLowerCase())}">
        <td class="col-character">
          <div class="character-cell">
            ${avatarHtml(item)}
            <div class="character-main">
              <div class="character-name-row">
                <span class="character-name">${escapeHtml(item.name || "-")}</span>
              </div>
              <div class="character-sub">
                <span class="server">서버 ${escapeHtml(formatNumber(item.serverRank || item.rank || 0))}위</span>
                <span>${escapeHtml(item.job || "직업 정보 없음")}</span>
              </div>
            </div>
          </div>
        </td>
        <td class="col-guild">${badgeHtml(item.guild || "길드 없음")}</td>
        <td class="col-center">${escapeHtml(item.level ? `Lv ${formatNumber(item.level)}` : "-")}</td>
        <td class="col-power" title="${escapeHtml(item.powerText || formatNumber(item.power))}">${escapeHtml(item.powerText || formatNumber(item.power))}</td>
        <td class="col-center">${metricHtmlLocal(weeklyDiff)}</td>
        <td class="col-center">${metricHtmlLocal(`${growthRate}%`)}</td>
        <td class="col-center">${escapeHtml(formatNumber(item.serverRank || item.rank || 0))}위</td>
        <td class="col-center">${escapeHtml(formatNumber(item.popularity || 0))}</td>
      </tr>
    `;
  }).join("");
}

function bindMembersEvents(rows) {
  const input = document.getElementById("membersSearchInput");
  const resetButton = document.getElementById("membersResetButton");
  const body = document.getElementById("membersTableBody");
  if (!input || !body) return;

  const applySearch = () => {
    const keyword = String(input.value || "").trim().toLowerCase();
    const trs = Array.from(body.querySelectorAll("tr[data-character-row]"));

    trs.forEach((tr) => {
      tr.style.display = "";
      tr.classList.remove("table-highlight");
    });

    if (!keyword) return;

    let firstMatch = null;
    trs.forEach((tr) => {
      const name = tr.getAttribute("data-character-row") || "";
      const matched = name.includes(keyword);
      if (!matched) {
        tr.style.display = "none";
      } else {
        tr.classList.add("table-highlight");
        if (!firstMatch) firstMatch = tr;
      }
    });

    if (firstMatch) {
      firstMatch.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  input.addEventListener("input", applySearch);
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      input.value = "";
      applySearch();
      input.focus();
    });
  }
}

function calculateGrowthRate(currentPower, weeklyDiff) {
  const current = toNumber(currentPower, 0);
  const diff = toNumber(weeklyDiff, 0);
  const prev = Math.max(current - diff, 0);
  if (prev <= 0 || diff === 0) return "0.00";
  return ((diff / prev) * 100).toFixed(2);
}

function toNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function emptyBox(message) {
  if (typeof createEmptyBox === "function") return createEmptyBox(message);
  return `<div style="padding:24px; text-align:center; color:#9ca3af;">${escapeHtml(message)}</div>`;
}

function avatarHtml(item) {
  if (typeof characterAvatarHtml === "function") return characterAvatarHtml(item);
  const src = String(item?.image || "").trim();
  if (!src) return '<div class="avatar-fallback">-</div>';
  return `<img class="character-avatar" src="${escapeHtml(src)}" alt="${escapeHtml(item?.name || "캐릭터")}" loading="lazy" decoding="async" />`;
}

function badgeHtml(guild) {
  if (typeof guildBadgeHtml === "function") return guildBadgeHtml(guild);
  return `<span class="guild-badge">${escapeHtml(guild)}</span>`;
}

function metricHtmlLocal(value) {
  if (typeof metricHtml === "function") return metricHtml(String(value));
  return `<span>${escapeHtml(String(value))}</span>`;
}

function formatNumber(value) {
  if (typeof window.formatNumber === "function" && window.formatNumber !== formatNumber) {
    return window.formatNumber(value);
  }
  return new Intl.NumberFormat("ko-KR").format(toNumber(value, 0));
}

function escapeHtml(value) {
  if (typeof window.escapeHtml === "function" && window.escapeHtml !== escapeHtml) {
    return window.escapeHtml(value);
  }
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
