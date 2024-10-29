import { db } from "../db/knex/db.js"
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { Router } from "express";
import { logEvents } from "../middlewares/logEvents.js";
const router = Router({ mergeParams: true });

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ 'message': 'Username and password are required.' });
  // check for duplicate usernames in the db
  const duplicate = await db.table("users")
    .where("email", "=", email)
    .first();

  //Conflict 
  if (duplicate) {
    return res.status(409).json({ error: true, message: "Email already registered" });
  } 

  try {
    //encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //store the new user
    const newUser = {
      id: randomUUID(),
      email,
      password: hashedPassword
    }
    await db.insert(newUser).into("users")
    res.status(201).json({ 'success': `New user ${email} created!` });
  } catch (err) {
    logEvents(err.message, "errorsLog.txt");
    res.status(500).json({ 'message': err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ 'message': 'Username and password are required.' });

  const foundUser = await db.table("users")
    .where("email", "=", email)
    .first();
  if (!foundUser) {
    return res.status(401).json({ error: true, message: "Credentials are incorrect" });
  }
  // evaluate password 
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    // create JWTs
    const accessToken = jwt.sign(
      { "id": foundUser.id, "email": foundUser.email }, 
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '24h' }
    );
    const refreshToken = jwt.sign(
      { "email": foundUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );
    // Saving refreshToken with current user
    const updateUser = { refresh_token: refreshToken }
    await db("users")
      .update(updateUser)
      .where("email", "=", email)
      .andWhere("id", "=", foundUser.id);

    res.cookie('refresh_token', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 168 * 60 * 60 * 1000 });
    res.json({ accessToken, message: "Logged in" });
  } else {
    logEvents(err.message, "errorsLog.txt");
    res.sendStatus(401);
  }
});

router.post("/logout", async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refresh_token) return res.sendStatus(204); //No content
  const refreshToken = cookies.refresh_token;

  // Is refreshToken in db?
  const foundUser = await db.table("users")
    .where("refresh_token", "=", refreshToken)
    .first();

  if (!foundUser) {
      res.clearCookie('refresh_token', { httpOnly: true, sameSite: 'None', secure: true });
      return res.sendStatus(204);
  }

  // Delete refreshToken in db
  const updateUser = { refresh_token: null };
  await db("users")
    .update(updateUser)
    .where("id", "=", foundUser.id);

  res.clearCookie('refresh_token', { httpOnly: true, sameSite: 'None', secure: true });
  res.sendStatus(204);
});

router.post("/refresh", async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refresh_token) return res.sendStatus(401);
  const refreshToken = cookies.refresh_token;

  const foundUser = await db.table("users")
    .where("refresh_token", "=", refreshToken)
    .first();

  if (!foundUser) return res.sendStatus(403); //Forbidden 
  // evaluate jwt 
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      console.log(decoded);
      console.log(foundUser);
      if (err || foundUser.email !== decoded.email) return res.sendStatus(403);
      const accessToken = jwt.sign(
        { "id" : foundUser.id, "email": decoded.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '48h' }
      );
      res.json({ accessToken, message: "Refreshed" })
    }
  );
});


export default router;