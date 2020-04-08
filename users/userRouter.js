const express = require("express");
const User = require("./userDb");
const Post = require("../posts/postDb");

const router = express.Router();

router.post("/", validateUser, async (req, res) => {
  try {
    const newUser = await User.insert(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "error processing request" });
  }
});

router.post("/:id/posts", validatePost, validateUserId, async (req, res) => {
  try {
    const id = req.params.id;
    const newPost = { ...req.body, user_id: id };
    const addedPost = await Post.insert(newPost);
    res.status(201).json(addedPost);
  } catch (error) {
    res.status(500).json({
      message: "Error processing request"
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.get();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Error processing request"
    });
  }
});

router.get("/:id", validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get("/:id/posts", validateUserId, async (req, res) => {
  try {
    const userPosts = await User.getUserPosts(req.params.id);
    res.status(200).json(userPosts);
  } catch (error) {
    res.status(500).json({ message: "error processing request" });
  }
});

router.delete("/:id", validateUserId, async (req, res) => {
  try {
    const id = req.user.id;
    await User.remove(id);
    res.status(200).json({ message: "user removed" });
  } catch (error) {
    res.status(500).json({ message: "could not process request" });
  }
});

router.put("/:id", validateUserId, validateUser, async (req, res) => {
  try {
    const id = req.params.id;
    const changes = req.body;

    await User.update(id, changes);
    res.status(200).json({ message: "username updated" });
  } catch (error) {
    res.status(500).json({ message: "could not process request" });
  }
});

//custom middleware

async function validateUserId(req, res, next) {
  try {
    const { id } = req.params;
    const user = await User.getById(id);
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "failed to process request" });
  }
}

async function validateUser(req, res, next) {
  try {
    if (req.body.name && req.body.name.length > 0) {
      next();
    } else {
      res.status(400).json({
        errorMessage: "Please provide a username"
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "error processing this request"
    });
  }
}

async function validatePost(req, res, next) {
  try {
    if (req.body.text.length > 0) {
      next();
    } else {
      res.status(400).json({ message: "text field was blank" });
    }
  } catch (error) {
    res.status(500).json({ message: "error prcoessing request" });
  }
}

module.exports = router;
