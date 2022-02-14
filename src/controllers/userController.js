import User from "../models/User";
import Video from "../models/Video";
import fetch from "node-fetch";
import bcrypt from "bcrypt";
import res from "express/lib/response";
import { token } from "morgan";
import { removeAllListeners } from "nodemon";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
  const { name, username, email, password, password1, location } = req.body;
  const usernameExists = await User.exists({ username });
  const emailExists = await User.exists({ email });

  if (password !== password1) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: "password does not match",
    });
  }

  if (usernameExists) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: "This username is already taken.",
    });
  }
  if (emailExists) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: "This email is already taken.",
    });
  }
  try {
    await User.create({
      name,
      username,
      email,
      password,
      location,
    });
    res.redirect("/login");
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Join",
      errorMessage: error._message,
    });
  }
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "login" });

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  // check if account exists
  const user = await User.findOne({ username, socialOnly: false });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle: "login",
      errorMessage: "Username does not exists.",
    });
  }
  // check password correct
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle: "login",
      errorMessage: "Wrong password.",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  //console.log(req.session);
  res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const url = `${baseUrl}?${params}`;
  return res.redirect(url);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const url = `${baseUrl}?${params}`;

  //fetch는 브라우저에서만 동작 (node-fetch 필요)
  const tokenRequest = await (
    await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    console.log(userData);
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      // create an account
      user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name ? userData.name : "Unknown",
        username: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "edit-profile" });
};

export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { name, email, username, location },
    file,
  } = req;
  const findUsername = await User.findOne({ username });
  const findEmail = await User.findOne({ email });
  if (
    (findUsername != null && findUsername._id != _id) ||
    (findEmail != null && findEmail._id != _id)
  ) {
    return res.render("edit-profile", {
      pageTitle: "Edit Profile",
      errorMessage: "User already Exist",
    });
  }
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? file.path : avatarUrl,
      name: name,
      username: username,
      email: email,
      location: location,
    },
    { new: true }
  );
  req.session.user = updatedUser;
  res.redirect("/users/edit");
};

export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    return res.redirect("/");
  }
  res.render("change-password", { pageTitle: "Change Password" });
};

export const postChangePassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword, newPasswordConfirm },
    session: {
      user: { _id, password },
    },
  } = req;
  const ok = await bcrypt.compare(oldPassword, password);
  if (!ok) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "Current password is incorrect",
    });
  }
  if (newPassword !== newPasswordConfirm) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "Password does not match",
    });
  }
  const user = await User.findById(_id);
  user.password = newPassword;
  await user.save();
  req.session.user.password = user.password;
  return res.redirect("/");
};

export const remove = (req, res) => res.send("Remove User");
export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const see = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("videos");
  console.log(user);
  if (!user) {
    return res.status(404).render("404", { pageTitle: "User not found" });
  }
  return res.render("profile", {
    pageTitle: `${user.name}의 profile`,
    user,
  });
};
