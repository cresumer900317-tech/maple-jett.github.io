document.addEventListener("DOMContentLoaded", async () => {
  renderShell();
  renderLoading("tips-page", "꿀팁 데이터를 불러오는 중...");
  try {
    const data = await getTipsData();
    document.getElementById("tips-page").innerHTML = `
      <section class="panel section-panel">
        <div class="panel-head"><div><h1 class="panel-title">꿀팁</h1><p class="panel-subtitle">팁과 노하우 모음</p></div></div>
        ${renderBoardList(data?.posts || [], '꿀팁 데이터가 없습니다.')}
      </section>
    `;
  } catch (error) {
    console.error(error);
    renderError("tips-page", error);
  }
});
