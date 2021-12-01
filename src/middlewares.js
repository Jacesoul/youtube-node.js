import multer from "multer";
export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Youbute";
  res.locals.loggedInUser = req.session.user || {};
  console.log(res.locals);
  next();
};

export const privateOnlyMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    res.redirect("/");
  }
};

export const uploadFiles = multer({
  dest: "uploads/",
});
