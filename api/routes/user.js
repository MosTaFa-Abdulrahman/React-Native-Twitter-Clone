const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { protectedRoute } = require("../utils/protectedRoute");

// Get By ((QUERY))
router.get("/get/:query", async (req, res) => {
  const { query } = req.params;
  try {
    let user;

    // query is userId
    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await User.findOne({ _id: query })
        .select("-password")
        .select("-updatedAt");
    } else {
      // query is username
      user = await User.findOne({ username: query })
        .select("-password")
        .select("-updatedAt");
    }

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search for User
router.get("/search", async (req, res) => {
  try {
    const query = req.query.q;
    const users = await User.find({ username: new RegExp(query, "i") });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Follow/UnFollow
router.post("/follow/:id", protectedRoute, async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = await User.findById(req.user._id);
    const anotherUser = await User.findById(id);

    if (id === req.user._d) {
      return res
        .status(400)
        .json({ error: "You cannot Follow/UnFollow Yourself 😉" });
    }

    if (!currentUser || !anotherUser) {
      return res.status(400).json({ error: "User not found 😣" });
    }

    const isFollowing = currentUser.followings.includes(id);
    if (isFollowing) {
      // UnFollow
      await User.findByIdAndUpdate(req.user._id, { $pull: { followings: id } });
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      res.status(200).json({ message: "User UnFollowed Successfully 😎" });
    } else {
      // Follow
      await User.findByIdAndUpdate(req.user._id, { $push: { followings: id } });
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      // Send notification to the user
      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: anotherUser._id,
      });

      await newNotification.save();

      res.status(200).json({ message: "User Followed Successfully 💘" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Suggested Users ((Focus 🧠))
router.get("/suggested/get", protectedRoute, async (req, res) => {
  try {
    const userId = req.user._id;
    // Get the authenticated user's followings
    const user = await User.findById(userId);
    const followings = user.followings;

    // Get users who are not already followed by the authenticated user
    const suggestedUsers = await User.find({
      _id: { $nin: [...followings, userId] }, // Exclude authenticated user and users already followed
    }).limit(10); // Limit to 10 suggested users

    res.status(200).json(suggestedUsers);
  } catch (error) {
    res.status(500).json("Error Get Suggested Users !😥");
  }
});

module.exports = router;
