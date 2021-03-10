"use strict";

// Import required packages
import express, { Response } from "express";

const router = express.Router();

import { User } from "../entities/User";

router.get("/", async (_request, response) => {
  const data = await User.db.findOne({ id: response.locals.userId });
  if (!data) {
    return response.status(404).send("Could not find your user.");
  }
  const user = new User(data);
  response.json(user.publicData());
});

router.post("/", async (request, response) => {
  if (!request.body.email || !request.body.password) {
    return response
      .status(400)
      .send("Error: email and password must be defined!");
  }

  const user = await User.generate(request.body.email, request.body.password);
  if (!user) return response.status(409).send("User already exists");
  await user.save();
  response.json(user.publicData());
});

const rejectLogin = (response: Response): void => {
  response.status(400).send("Incorrect username or password!");
};

router.post("/login", async (request, response) => {
  if (!request.body.email || !request.body.password) {
    return response
      .status(401)
      .send("Error: email and password must be defined!");
  }

  const userdata = await User.db.findOne({ email: request.body.email });
  if (!userdata) return rejectLogin(response);

  const user = new User(userdata);
  if (!(await user.compare(request.body.password)))
    return rejectLogin(response);

  const token = user.generateToken();

  response.json({ token: token });
});

export default router;
