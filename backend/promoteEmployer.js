
require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./models/User");

async function promoteEmployer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const user = await User.findOneAndUpdate(
      { email: "employerB@example.com" },
      { role: "employer" },
      { new: true, runValidators: true }
    );

    if (!user) {
      console.log("User not found. Register the account first.");
      return;
    }

    console.log(`Promoted ${user.email} to ${user.role}`);
  } catch (error) {
    console.error("Promotion failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

promoteEmployer();