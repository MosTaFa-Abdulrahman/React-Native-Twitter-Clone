const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const Notification = require("../models/Notification");
const { protectedRoute } = require("../utils/protectedRoute");

// To Upload Image
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: ["jpg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});
const parser = multer({ storage: storage });

// Create Post
router.post("/create", parser.single("image"), async (req, res) => {
  try {
    const imageUrl = req.file.path;
    const { postedBy, text } = req.body;

    const newPost = new Post({ postedBy, text, img: imageUrl });
    await newPost.save();

    res.status(200).json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete
router.delete("/delete/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post Deleted Successfully 🥰" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Posts
router.get("/all", async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "postedBy",
        select: "-password",
      })
      .populate({
        path: "replies.userId",
        select: "-password",
      });

    if (posts.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Error in getAllPosts" });
  }
});

// Get All Posts for (((Special User))) ((currentUser))
router.get("/profile/:username", protectedRoute, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ error: "User Not Found 😥" });
    }
    const posts = await Post.find({ postedBy: user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Feed Posts (Friends Posts)
router.get("/feed", protectedRoute, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User Not Found 😥" });
    }

    const followings = user.followings;
    const feedPosts = await Post.find({
      postedBy: { $in: followings },
    }).sort({ createdAt: -1 });
    res.status(200).json(feedPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like/DisLike
router.put("/like/:id", protectedRoute, async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ error: "Post not found 😣" });

    const userLikedPost = post.likes.includes(userId);
    if (userLikedPost) {
      // DisLike
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      res.status(200).json({ message: "Post DisLiked Successfully 😀" });
    } else {
      // Like
      post.likes.push(userId);
      await post.save();

      const notification = new Notification({
        from: userId,
        to: post.postedBy,
        type: "like",
      });
      await notification.save();
      res.status(200).json({ message: "Post Liked Successfully 😍" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Liked Posts for (((Special User))) ((currentUser))
router.get("/liked-posts/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Query for posts where the userId is present in the likes array
    const likedPosts = await Post.find({ likes: userId })
      // Populate the postedBy field to get user details
      .populate("postedBy", "username userProfilePic")
      .exec();

    res.status(200).json(likedPosts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch liked posts" });
  }
});

// Reply To Post ((ADD Comment))
router.put("/reply/:postId", async (req, res) => {
  try {
    const { text } = req.body;
    // const userId = req.user._id;
    const userId = req.body.userId;

    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newReply = {
      userId: user._id,
      text,
      userProfilePic: user.profilePic,
      username: user.username,
    };

    post.replies.push(newReply);
    await post.save();

    // Fetch the post again and populate replies' userId with only necessary fields
    const populatedPost = await Post.findById(post._id).populate({
      path: "replies.userId",
      select: "username profilePic",
    });
    const latestReply = populatedPost.replies[populatedPost.replies.length - 1];

    res.status(200).json(latestReply);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//((Delete Comment))
router.delete("/:postId/replies/:replyId", async (req, res) => {
  try {
    const { postId, replyId } = req.params;
    // const userId = req.user._id;
    const userId = req.body.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json("Post not found 😥");
    }

    const replyIndex = post.replies.findIndex(
      (reply) => reply._id.toString() === replyId
    );
    const replyUserId = post.replies.findIndex(
      (reply) => reply.userId.toString() === userId
    );

    // Check if the reply exists
    if (replyIndex === -1) {
      return res.status(404).json({ error: "Reply not found" });
    }

    if (replyUserId) {
      // Remove the reply from the replies array
      post.replies.splice(replyIndex, 1);

      await post.save();

      res.status(200).json("Reply deleted successfully 😙");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
