const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtns = document.querySelectorAll(".video__comment-delete");

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  // pug에서 만들고 있는 HTML과 동일한 li, i, span 생성
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const deleteSpan = document.createElement("span");
  deleteSpan.className = "video__comment-delete";
  deleteSpan.innerText = `❌`;
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(deleteSpan);
  // 생성한 li,i,span을 ul에 결합
  videoComments.prepend(newComment);
  deleteSpan.addEventListener("click", handleDeleteComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }, // express.json()에게 json으로 보내고 있다고 알려줘야 한다.
    body: JSON.stringify({ text }), // JSON을 string으로 변환해서 서버에 전송
  }); // fetch는 Promise를 return한다. 끝나는데 시간이 걸리기 때문에 await을 해줘야한다.
  textarea.value = "";
  if (response.status === 201) {
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};
const handleDeleteComment = async (event) => {
  const videoId = videoContainer.dataset.id;
  const li = event.srcElement.parentNode;
  const {
    dataset: { id },
  } = li;
  const response = await fetch(`/api/comments/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoId }),
  });
  if (response.status === 200) {
    li.remove();
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
if (deleteBtns) {
  deleteBtns.forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", handleDeleteComment);
  });
}
