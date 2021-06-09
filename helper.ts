import { config } from "https://deno.land/x/dotenv/mod.ts";

export function isEmail(email: string): boolean {
  // Copied RegExp from https://stackoverflow.com/a/46181
  const regex = new RegExp(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  );
  return regex.test(email);
}

export function isPassword(password: string): boolean {
  // Copied RegExp from https://stackoverflow.com/a/5142164
  const regex = new RegExp(
    /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/,
  );
  return regex.test(password);
}

export function isPowerpoint(filename: string): boolean {
  // Copied RegExp from https://stackoverflow.com/a/374956
  const regex = new RegExp(/^.*\.(pptx)$/);
  return regex.test(filename);
}

export function isTemporary(filename: string): boolean {
  const regex = new RegExp(/^~\$/);
  return regex.test(filename);
}

export function isLength(input: string): boolean {
  const result = input.length >= 3 && input.length <= 255;
  return result;
}

export function initializeEnv(variables: Array<string>) {
  // Load .env file
  config({ export: true });

  // Loop over every key and make sure it has been set
  variables.forEach((variable: string) => {
    if (!Deno.env.get(variable)) {
      throw new Error(`${variable} .env variable must be set.`);
    }
  });
}
