document.addEventListener("DOMContentLoaded", async () => {
  const posts = await getTipsPosts();
  renderBoardList("tipsList", posts);
  renderFooter();
});

function renderFooter() {
  const footer = document.getElementById("footerApiText");
  if (!footer) return;
  footer.textContent = "꿀팁 게시판";
}