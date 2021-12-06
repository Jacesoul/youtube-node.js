import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const files = {
  input: "recording.webm",
  output: "output.mp4",
  thumb: "thumbnail.jpg",
};

const downloadFile = (fileUrl, fileName) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click(); // 사용자 대신 링크를 클릭
};

const handleDownload = async () => {
  actionBtn.removeEventListener("click", handleDownload);
  actionBtn.innerText = "Transcoding...";
  actionBtn.disabled = true;

  const ffmpeg = createFFmpeg({ log: true }); // log:true를 통해 무슨일이 벌어지는지 콘솔창에서 확인할수 있다.
  await ffmpeg.load();

  ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile)); // videoFile은 blob이다.

  await ffmpeg.run("-i", files.input, "-r", "60", files.output); // ffmpeg를 사용자의 브라우저에서 로딩하기 때문에 ffmpeg 명령어를 사용자의 브라우저에서 실행되게 할수 있다. 여기서 recording.webm는 파일이고 input으로 받아서 output으로 변환해주는 명령어이다. "-r", "60"은 영상을 초당 60프레임으로 인코딩해주는 명령어이다. 즉, 더 빠른 영상 인코딩을 가능하게 해준다.

  await ffmpeg.run(
    "-i",
    files.input,
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    files.thumb
  ); // -ss는 영상의 특정 시간대로 갈수 있게 해준다. "-frames:v" "1"은 첫 프레임의 스크린샷을 찍어준다. 그 파일을 thumbnail.jpg로 저장한다. 이 파일은 파일시스템(FS)의 메모리에 만들어진다.

  const mp4File = ffmpeg.FS("readFile", files.output); // Unit8Array는 unsigned integer아다. 이것은 양의 정수를 의미한다. 반대로 signed는 음의 정수를 의미한다.
  const thumbFile = ffmpeg.FS("readFile", files.thumb); // 계속 이쪽에서 path를 찾을수없다는 에러메세지가 나오는데 녹화를 1초보다 짧게하면 나오는 오류이다.

  console.log(mp4File); // Unit8Array -> 자바스크립트가 파일을 보여주는 방식이다. 그렇지만 이것을 가지고는 아무것도 할수가 없다. 그래서 blob을 만든다. [blob]은 자바스크립트 세계의 파일과 같다.(binary정보를 가지고 있는 파일)
  console.log(mp4File.buffer); // ArrayBuffer -> Unit8Array로 부터 blob을 만들수는 없지만 ArrayBuffer로는 만들수 있다. Unit8Array의 raw data, 즉 binary data에 접근하려면 mp4File.buffer를 사용해야한다. [ArrayBuffer]는 raw binary data를 나타내는 object이다. 한마디로 영상을 나타내는 bytes의 배열이다.

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

  const mp4Url = URL.createObjectURL(mp4Blob); // blob은 자바스크립트 세계의 파일인데 여기에는 binary data를 줘야한다.
  const thumbUrl = URL.createObjectURL(thumbBlob);

  downloadFile(mp4Url, "MyRecording2.mp4");
  downloadFile(thumbUrl, "MyThumbnail.jpg");

  ffmpeg.FS("unlink", files.input); // 브라우저가 느려지는것을 막기위해서 파일들을 메모리에서 삭제하기 위해 unlink를 한다.
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumb);

  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbUrl);
  URL.revokeObjectURL(videoFile);

  actionBtn.disabled = false;
  actionBtn.innerText = "Record Again";
  actionBtn.addEventListener("click", handleStart);
};

const handleStop = () => {
  actionBtn.innerText = "Download Recording";
  actionBtn.removeEventListener("click", handleStop);
  actionBtn.addEventListener("click", handleDownload);
  recorder.stop();
};

const handleStart = () => {
  actionBtn.innerText = "Stop recording";
  actionBtn.removeEventListener("click", handleStart);
  actionBtn.addEventListener("click", handleStop);

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

actionBtn.addEventListener("click", handleStart);
