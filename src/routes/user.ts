"use strict";

// Import required packages
import express from "express";

const router = express.Router();

import { User } from "../entities/User";

router.get("/", async (_request, response) => {
  const data = await User.db.findOne({ id: response.locals.userId });
  if (!data) {
    return response.send("Could not find your user.");
  }
  const user = new User(data);
  response.json(user.publicData());
});

router.post("/", async (request, response) => {
  if (!request.body.email || !request.body.password) {
    return response.send("Error: email and password must be defined!");
  }

  const user = await User.generate(request.body.email, request.body.password);
  if (!user) return response.send("User already exists");
  await user.save();
  response.json(user.publicData());
});

export default router;
