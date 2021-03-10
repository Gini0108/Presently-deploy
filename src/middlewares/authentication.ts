import { RequestHandler, Response } from "express";
import { verify, sign } from "jsonwebtoken";
import { User } from "../entities/User";

if (!process.env.JWTSECRET)
  throw new Error("Environment Variable JWTSECRET not found.");
const clientSecret = process.env.JWTSECRET;

export const checkToken: RequestHandler = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return rejectClient(res);

  try {
    const decodedToken = verify(token, clientSecret);
    if (typeof decodedToken != "string") return rejectClient(res);

    const user = await User.db.findOne({ id: decodedToken });
    if (!user) return rejectClient(res);

    // Allow request
    res.locals.userId = user.id;

    next();
  } catch (error) {
    console.error(error);
    rejectClient(res);
  }
};

const rejectClient = (res: Response) => {
  res.status(401).json({
    message: "User is not authorized",
    payload: undefined,
  });
};

export const signToken = (user: User): string => {
  return sign(user.id, clientSecret);
};
