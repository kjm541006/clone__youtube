var multer = require("multer");

export const localsMiddleware = (req, res, next) => {
  console.log(req.session);
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user;
  //console.log(req.session.user);

  next();
};

//login하지 않은 유저가 잘못된 접근 할 경우
export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    // return res.redirect("/login");
    res.send("<script>alert('로그인하세요.');location.href='/login';</script>");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/");
  }
};

export const uploadFiles = multer({ dest: "uploads/" });
