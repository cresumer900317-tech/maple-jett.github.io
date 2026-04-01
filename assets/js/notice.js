document.addEventListener("DOMContentLoaded", async () => {
  const posts = await getNoticePosts();
  renderBoardList("noticeList", posts);
});