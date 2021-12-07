const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }, // express.json()에게 json으로 보내고 있다고 알려줘야 한다.
    body: JSON.stringify({ text }), // JSON을 string으로 변환해서 서버에 전송
  });
  textarea.value = "";
  window.location.reload(); // 댓글을 달때마다 페이지를 새로고침한다. 그렇게 되면 매 댓글에 DB에서 동영상을 찾게 되어 부하가 걸리는 작업일수 있다.
};
if (form) {
  form.addEventListener("submit", handleSubmit);
}
