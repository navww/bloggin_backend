const User = require("../models/User");
const Blog = require("../models/Blog");

exports.createBlog = async (req, res) => {
  try {
    const blog = await Blog.create({
      user: req.user.id,
      content: req.body.content,
    });
    res.status(200).send({ data: blog, message: "Blog Created Successfully" });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ message: "Something Went Wrong" });
  }
};

exports.getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res
      .status(200)
      .send({ data: blogs, message: "My Blogs Fetched Successfully" });
  } catch (err) {
    console.log(err.message);
    return res.status(400).send({ message: "Something Went Wrong" });
  }
};

exports.followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);
    if (!userToFollow || !currentUser)
      return res.status(404).json({ error: "User not found" });

    // console.log("userToFollow", userToFollow);
    // console.log("currentUser", currentUser);
    // console.log("currentUser.following", currentUser.following);
    // console.log("userTofflow.flloowers", userToFollow.followers);

    if (!currentUser.following.includes(userToFollow._id)) {
      currentUser.following.push(userToFollow._id);
      userToFollow.followers.push(currentUser._id);
      await userToFollow.save();
      await currentUser.save();
    }

    return res.status(200).send({ message: "Followed successfully" });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ message: "Something Went Wrong" });
  }
};

exports.unfollowUser = async (req, res) => {
  console.log("unfollow user", req.params.id);

  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);
    if (!userToUnfollow || !currentUser)
      return res.status(404).json({ error: "User not found" });

    currentUser.following = currentUser.following.filter(
      (id) => !id.equals(userToUnfollow._id)
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => !id.equals(currentUser._id)
    );

    await currentUser.save();
    await userToUnfollow.save();

    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ error: "Something Went Wrong" });
  }
};

// this function take out following users blogs
exports.getMyFeed = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const blogs = await Blog.find({ user: { $in: currentUser.following } })
      .sort({ createdAt: -1 })
      .populate("user", "username email");

    return res.status(200).send({
      data: blogs,
      message: "Following Blogs Fetched Successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// take out all blogs  including current user
exports.getAllBlogsWithUser = async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    for (let i = 0; i < blogs.length; i++) {
      const user = await User.findById(blogs[i].user);
      blogs[i].user = user;
    }

    return res
      .status(200)
      .send({ data: blogs, message: "All Blogs Fetched Successfully" });
  } catch (err) {
    console.log(err.message);
    return res.status(400).send({ message: "Something Went Wrong" });
  }
};
