import UsersList from "../../models/UsersDetails.model.js";


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: "Email and password required" });
    }

    // Authenticate against users_list
    const user = await UsersList.findOne({ where: { email } });

    if (!user) {
      console.log(`Login attempt failed: User not found for email ${email}`);
      return res.json({ success: false, message: "User not found" });
    }

    if (user.password !== password) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    // Fetch additional details from users_details
    const userDetails = await UsersList.findOne({ where: { email } });

    // Merge details safely
    const profileData = {
      id: user.id,
      email: user.email,
      username: user.username,
      name: userDetails?.name || user.username,
      usercode: userDetails?.usercode || "N/A",
      gender: userDetails?.gender || "O",
      role: userDetails?.role || "user",
      created_at: userDetails?.created_at || null
    };

    res.json({
      success: true,
      message: "Login successful",
      user: profileData,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
