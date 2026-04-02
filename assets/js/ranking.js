document.addEventListener('DOMContentLoaded',async()=>{renderShell();renderLoading('ranking-page','랭킹 데이터를 불러오는 중...');try{const rows=await getRankingData();const list=Array.isArray(rows)?rows:[];const root=document.getElementById('ranking-page');root.innerHTML=renderRankingPage(list);bindRankingEvents();}catch(error){console.error(error);renderError('ranking-page',error);}});

function renderRankingPage(rows){
  return `
    <section class="page-card">
      <div class="section-head">
        <div>
          <h1 class="section-title">통합 랭킹</h1>
          <p class="section-sub">리스트는 유지하고 검색 캐릭터만 강조 표시됩니다.</p>
        </div>
      </div>

      <div class="toolbar-card">
        <label class="search-field">
          <span>🔎</span>
          <input id="rankingSearchInput" type="text" placeholder="캐릭터명 검색" autocomplete="off" />
        </label>
        <button id="rankingResetButton" class="ghost-btn" type="button">초기화</button>
      </div>

      <div id="rankingScrollPanel" class="scroll-panel ranking-scroll">
        <div id="rankingCardList" class="stack-list">
          ${rows.length ? rows.map((item, index) => rankingCard(item, index + 1)).join('') : createEmptyBox('랭킹 데이터가 없습니다.')}
        </div>
      </div>
    </section>
  `;
}

function rankingCard(item, displayRank){
  return `
    <article class="list-card" data-character-row="${escapeHtml(String(item.name||'').toLowerCase())}">
      <div class="card-left">
        <div class="rank-chip">${displayRank}</div>
        ${characterAvatarHtml(item)}
      </div>
      <div class="card-main">
        <div class="card-topline">
          <div>
            <div class="rank-name">${escapeHtml(item.name||'-')}</div>
            <div class="rank-subline">
              ${guildBadgeHtml(item.guild||'길드 없음')}
              <span>${escapeHtml(item.job||'-')}</span>
              <span>Lv ${escapeHtml(item.level||'-')}</span>
            </div>
          </div>
          <div class="rank-power">${escapeHtml(formatCompactPower(item.powerText||'-'))}</div>
        </div>

        <div class="meta-grid four">
          <div class="mini-stat"><span>서버 순위</span><strong>${item.serverRank ? `${escapeHtml(formatNumber(item.serverRank))}위` : '-'}</strong></div>
          <div class="mini-stat"><span>통합 순위</span><strong>${escapeHtml(item.overallRank || displayRank)}</strong></div>
          <div class="mini-stat"><span>인기도</span><strong>${escapeHtml(formatNumber(item.popularity || 0))}</strong></div>
          <div class="mini-stat"><span>서버 변동</span><strong>${rankTrendHtml(item)}</strong></div>
        </div>
      </div>
    </article>
  `;
}

function bindRankingEvents(){
  const input=document.getElementById('rankingSearchInput');
  const resetButton=document.getElementById('rankingResetButton');
  const panel=document.getElementById('rankingScrollPanel');
  const wrap=document.getElementById('rankingCardList');
  if(!input||!panel||!wrap) return;

  const applySearch=()=>{
    const keyword=String(input.value||'').trim().toLowerCase();
    const rows=Array.from(wrap.querySelectorAll('[data-character-row]'));

    rows.forEach(row=>row.classList.remove('highlight-card','dim-card'));

    if(!keyword) return;

    let firstMatch=null;
    rows.forEach(row=>{
      const name=row.getAttribute('data-character-row')||'';
      const matched=name.includes(keyword);
      if(matched){
        row.classList.add('highlight-card');
        if(!firstMatch) firstMatch=row;
      }else{
        row.classList.add('dim-card');
      }
    });

    if(firstMatch){
      const panelRect=panel.getBoundingClientRect();
      const itemRect=firstMatch.getBoundingClientRect();
      const offset=itemRect.top-panelRect.top+panel.scrollTop-120;
      panel.scrollTo({top:Math.max(offset,0),behavior:'smooth'});
    }
  };

  input.addEventListener('input',applySearch);
  if(resetButton){
    resetButton.addEventListener('click',()=>{
      input.value='';
      applySearch();
      input.focus();
    });
  }
}
