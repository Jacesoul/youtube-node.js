const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const addComment = (text) => {
  const videoComments = document.querySelector(".video__comments ul");
  // pug에서 만들고 있는 HTML과 동일한 li, i, span 생성
  const newComment = document.createElement("li");
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  newComment.appendChild(icon);
  newComment.appendChild(span);
  // 생성한 li,i,span을 ul에 결합
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const { status } = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }, // express.json()에게 json으로 보내고 있다고 알려줘야 한다.
    body: JSON.stringify({ text }), // JSON을 string으로 변환해서 서버에 전송
  }); // fetch는 Promise를 return한다. 끝나는데 시간이 걸리기 때문에 await을 해줘야한다.
  textarea.value = "";
  if (status === 201) {
    addComment(text);
  }
};
if (form) {
  form.addEventListener("submit", handleSubmit);
}
