import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.set("view engine", "ejs"); // ✅ Sets EJS as the template engine

const __dirname = dirname(fileURLToPath(import.meta.url));
app.set("views", join(__dirname, "pages")); // ✅ Tells Express where to find .ejs files

let posts = []; // Array to store posts
let idx = 0;

// GET REQUEST (/)
app.get("/", (req, res) => {
  res.render("../pages/index.ejs");
});

// GET REQUEST (/view)
app.get("/view", (req, res) => {
  res.render("view", { posts: posts, idx: idx });
});

// ✅ Separate route for adding posts
app.post("/view", (req, res) => {
  const newPost = req.body.createPost;
  if (newPost) {
    idx++;
    const postObject = {
      content: newPost,
      author: "div",
      timestamp: new Date().toLocaleString(),
    };

    posts.unshift(postObject);
    // console.log(posts);
  }

  res.redirect("/view");
  /*res.json({ success: true }); // ✅ Return JSON instead of redirect*/
});

// ✅ New route for deleting posts
app.post("/delete", (req, res) => {
  const postId = parseInt(req.body.postId);

  if (!isNaN(postId) && postId >= 0 && postId < posts.length) {
    posts.splice(postId, 1);
    // console.log("Deleted post ID:", postId);
    return res.json({ success: true });
  }

  res.json({ success: false, message: "Invalid post ID" });
});

// edit page
app.get("/update", (req, res) => {
  const postIdx = parseInt(req.query.postId);

  if (isNaN(postIdx) || postIdx < 0 || postIdx >= posts.length) {
    return res.status(404).send("Post not found");
  }

  const oldData_object = posts[postIdx];
  const oldData = oldData_object.content;

  res.render("edit", { oldData: oldData, postId: postIdx });
});

app.post("/edit", (req, res) => {
  const UpdatedData = req.body.editPost;
  const postId = parseInt(req.body.value);

  const updatedpostObject = {
    content: UpdatedData,
    author: "div",
    timestamp: new Date().toLocaleString(),
  };

  if (postId < 0 || postId >= posts.length) {
    return res.send("Invalid Post ID");
  }
  posts.splice(postId, 1, updatedpostObject);
  res.redirect("/view");
});

// GET REQUEST (/edit)

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
