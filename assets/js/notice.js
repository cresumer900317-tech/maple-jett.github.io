document.addEventListener("DOMContentLoaded", async () => {
  renderShell();
  renderLoading("notice-page", "공지 데이터를 불러오는 중...");
  try {
    const data = await getNoticeData();
    document.getElementById("notice-page").innerHTML = `
      <section class="panel section-panel">
        <div class="panel-head"><div><h1 class="panel-title">공지</h1><p class="panel-subtitle">운영 공지와 안내</p></div></div>
        ${renderBoardList(data?.posts || [], '공지 데이터가 없습니다.')}
      </section>
    `;
  } catch (error) {
    console.error(error);
    renderError("notice-page", error);
  }
});
