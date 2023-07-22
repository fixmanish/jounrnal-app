//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://dynamicmanish902:123manish@cluster0.4ztxs8q.mongodb.net/blogDB",
  { useNewUrlParser: true }
);
const app = express();

const blogSchema = mongoose.Schema({
  title: String,
  content: String,
});

const blogModel = mongoose.model("blog", blogSchema, "blogs");

const homeStartingContent =
  " Welcome to my new journal website! 📚🖋️ Discover the power of self-expression and reflection as you save and organize your text journals effortlessly. Visit the specific diary entry by adding '/posts/title name' to the url on home page.";

const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";

const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// let postsArray = [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  // res.render("home", { startingContent: homeStartingContent, posts: posts });
  blogModel
    .find({}, "title content")
    .then((blogModel) => {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: blogModel,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutDesc: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactDesc: aboutContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

// getting routing parameters

app.get("/posts/:userPostID", function (req, res) {
  const userReqTitleID = req.params.userPostID;
  blogModel
    .findById(userReqTitleID)
    .then((foundPost) => {
      if (foundPost) {
        res.render("post", {
          composeTitle: foundPost.title,
          composePost: foundPost.content,
        });
      } else {
        res.redirect("/");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/compose", function (req, res) {
  const blogEntry = new blogModel({
    title: req.body.userTitle,
    content: req.body.userPost,
  });

  blogEntry
    .save()
    .then(() => {
      console.log("Successfully saved to the database.");
      // postsArray.push(blogEntry);
      // console.log(postsArray);
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.render("compose");
    });
});

app.listen(3000, function () {
  console.log("Server started at port 3000.");
});
