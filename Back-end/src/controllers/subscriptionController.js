import User from "../models/User.js";

export const getMySubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("subscription");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, subscription: user.subscription });
  } catch (error) {
    console.error("Get Subscription Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
