document.addEventListener("DOMContentLoaded", async () => {
  const posts = await getTipsPosts();
  renderBoardList("tipsList", posts);
});