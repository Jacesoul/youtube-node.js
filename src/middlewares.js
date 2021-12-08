import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const multerUploader = multerS3({
  s3: s3,
  bucket: "youtubeee",
});

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Youbute";
  res.locals.loggedInUser = req.session.user || {};
  next();
};

export const privateOnlyMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Log in first");
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not authorized");
    res.redirect("/");
  }
};

export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 3000000, //3 Megabytes
  },
  storage: multerUploader,
});

export const videoUpload = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: 50000000, // 10 Megabytes
  },
  storage: multerUploader,
});
