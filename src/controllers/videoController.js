import res from "express/lib/response";

export const trending = (req, res) => res.render("home");

export const watch = (req, res) => res.render("watch");
export const edit = (req, res) => res.send("Edit");
export const deleteVideo = (req, res) => res.send("Delete Video");
export const search = (req, res) => res.send("Search");
export const upload = (req, res) => res.send("Upload");
