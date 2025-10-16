import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = Router();

const users = [
  { username: "testuser", password: bcrypt.hashSync("testpassword", 10) }
];

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: "Username and password required" });

  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ username }, process.env.JWT_SECRET || "secretkey", {
    expiresIn: "1h"
  });

  res.json({ token });
});

export default router;
