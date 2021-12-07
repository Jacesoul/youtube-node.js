const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const handleSubmit = (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }, // express.json()에게 json으로 보내고 있다고 알려줘야 한다.
    body: JSON.stringify({ text }), // JSON을 string으로 변환해서 서버에 전송
  });
  textarea.value = "";
};
if (form) {
  form.addEventListener("submit", handleSubmit);
}
