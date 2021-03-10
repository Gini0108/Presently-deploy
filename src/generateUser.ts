/*
Generate new user, node generateUser [username] [password]
*/

import { config } from "dotenv";
config();

import { User } from "./entities/User";
import { signToken } from "./middlewares/authentication";

const args = process.argv.slice(2);

const email = args[0];
const password = args[1];

(async () => {
  const user = await User.generate(email, password);
  if (!user) throw new String("User already exists");

  const token = signToken(user);
  console.log(`Token: ${token}`);

  console.log("User: ", JSON.stringify(user));
})();
