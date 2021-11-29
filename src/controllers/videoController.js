import Video from "../models/Video";

export const home = async (req, res) => {
  /* callback을 쓰는 경우
  Video.find({}, (err, videos) => {
    if(error){
      return res.render("server-error");
    }
    return res.render("home", { pageTitle: "HOME", videos: [] });
  });
  */
  try {
    const videos = await Video.find({});
    console.log(videos);
    return res.render("home", { pageTitle: "Home", videos });
  } catch {
    return res.render("server-error");
  }
};
export const watch = (req, res) => {
  const { id } = req.params; // const id = req.params.id와 같다.
  return res.render("watch", { pageTitle: `Watching` });
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  return res.render("edit", { pageTitle: `Editing ` });
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};
export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try {
    /* create메소드로 같은 기능을 할수 있다. 
    await Video.create({
      title,
      description,
      createdAt: Date.now(),
      hashtags: hashtags.split(",").map((word) => `#${word}`),
      meta: {
        views: 0,
        rating: 0,
      },
    });
    */
    const video = new Video({
      title,
      description,
      hashtags: hashtags.split(",").map((word) => `#${word}`),
    });
    // database에 기록되고 저장되는데에는 시간이 걸리기 때문에 기다려줘야한다.
    await video.save();
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};
