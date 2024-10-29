
import { db } from "../db/knex/db.js"
import { Router } from "express";
const router = Router({ mergeParams: true });

router.get("/me", async (req, res) => {
  const userDecoded = req.user;

  if (!userDecoded) {
    return res.status(403).json({ error: true, message: "Invalid session"})
  }
  const userData = await db.table("users")
    .select("id","name","surname","email","phone","verification","status","created_at")
    .where("id", "=", userDecoded.id)
    .first();

  return res.json({
    data: userData,
    message: null
  })
});

export default router;