import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const handleDownload = async () => {
  const ffmpeg = createFFmpeg({ log: true }); // log:true를 통해 무슨일이 벌어지는지 콘솔창에서 확인할수 있다.
  await ffmpeg.load();

  ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile)); // videoFile은 blob이다.

  await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4"); // ffmpeg를 사용자의 브라우저에서 로딩하기 때문에 ffmpeg 명령어를 사용자의 브라우저에서 실행되게 할수 있다. 여기서 recording.webm는 파일이고 input으로 받아서 output으로 변환해주는 명령어이다. "-r", "60"은 영상을 초당 60프레임으로 인코딩해주는 명령어이다. 즉, 더 빠른 영상 인코딩을 가능하게 해준다.

  const mp4File = ffmpeg.FS("readFile", "output.mp4"); // unsigned integer은 양의 정수를 의미한다. 반대로 signed는 음의 정수를 의미한다.

  console.log(mp4File); // Unit8Array -> 자바스크립트가 파일을 보여주는 방식이다. 그렇지만 이것을 가지고는 아무것도 할수가 없다. 그래서 blob을 만든다. blob은 자바스크립트 세계의 파일과 같다.(binary정보를 가지고 있는 파일)
  console.log(mp4File.buffer); // ArrayBuffer -> Unit8Array로 부터 blob을 만들수는 없지만 ArrayBuffer로는 만들수 있다. Unit8Array의 raw data, 즉 binary data에 접근하려면 mp4File.buffer를 사용해야한다. ArrayBuffer는 raw binary data를 나타내는 object이다. 한마디로 영상을 나타내는 bytes의 배열이다.

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });

  const mp4Url = URL.createObjectURL(mp4Blob);

  const a = document.createElement("a");
  a.href = mp4Url;
  a.download = "MyRecording2.mp4";
  document.body.appendChild(a);
  a.click(); // 사용자 대신 링크를 클릭
};

const handleStop = () => {
  startBtn.innerText = "Download Recording";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleDownload);
  recorder.stop();
};

const handleStart = () => {
  startBtn.innerText = "Stop recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);

  recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data); // event.data는 blob이다.
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
  };
  recorder.start();
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
  });
  video.srcObject = stream;
  video.play();
};

init();

startBtn.addEventListener("click", handleStart);
