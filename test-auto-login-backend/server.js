const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 4000;

// FIX: Remove space after "http://"
app.use(
  cors({
    origin: "http://172.23.48.1:3000", // ✅ No space after http://
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// Dummy login route to set cookie
app.post("/login", (req, res) => {
  const { username } = req.body;

  if (username) {
    res.cookie("user", username, {
      httpOnly: false, // Should be true in production
      sameSite: "Lax",
    });
    return res.json({ message: "Logged in successfully" });
  } else {
    return res.status(400).json({ message: "Username required" });
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Get current user from cookie
app.get("/me", (req, res) => {
  const user = req.cookies.user;
  if (user) {
    return res.json({ loggedIn: true, user });
  } else {
    return res.json({ loggedIn: false });
  }
});

// Logout route
app.post("/logout", (req, res) => {
  res.clearCookie("user");
  return res.json({ message: "Logged out" });
});

// FIX: Remove space after http://
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://172.23.48.1:${PORT}`);
});
