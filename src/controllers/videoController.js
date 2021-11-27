import Video from "../models/Video";

export const home = (req, res) => {
  console.log("Starting Search");
  Video.find({}, (err, videos) => {
    console.log("Search Finished");
    return res.render("home", { pageTitle: "HOME", videos: [] });
  });
  console.log("I finished first");
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
export const postUpload = (req, res) => {
  // here we will add a video to the videos array.
  console.log(req.body);
  const { title } = req.body;
  return res.redirect("/");
};
