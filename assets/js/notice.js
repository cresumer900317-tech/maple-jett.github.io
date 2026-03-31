document.addEventListener("DOMContentLoaded", async () => {
  const posts = await getNoticePosts();
  renderBoardList("noticeList", posts);
  renderFooter();
});

function renderFooter() {
  const footer = document.getElementById("footerApiText");
  if (!footer) return;
  footer.textContent = "공지 게시판";
}