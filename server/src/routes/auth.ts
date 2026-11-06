import { Router, Request, Response } from "express";
import { prisma } from "../prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "Failed data" });

    const existUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existUser)
      return res
        .status(400)
        .json({ error: "User with this email already exist" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: email,
        name: name,
        password: hashedPassword,
        role: "USER",
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
      },
    });

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).json({ token, user: user });
  } catch (err) {
    return res.status(500).json({ error: "Failed registration" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Entered email or password" });

    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!user) return res.status(400).json({ error: "invalid data" });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(400).json({ message: "Wrong passwrod" });

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password: _, ...userWithoutPassword } = user;

    return res.json({ token, user: userWithoutPassword });
  } catch (err) {
    return res.status(500).json({ error: "Failed authorization" });
  }
});

export default router;
