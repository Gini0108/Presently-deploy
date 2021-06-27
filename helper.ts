import { config } from "https://deno.land/x/dotenv@v2.0.0/mod.ts";

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

export function cleanHex(hex: string): string {
  // Re-add the dashes and turn the string into lowercase
  const dashed = `${hex.substr(0, 8)}-${hex.substr(8, 4)}-${
    hex.substr(12, 4)
  }-${hex.substr(16, 4)}-${hex.substr(20)}`;
  const lower = dashed.toLowerCase();

  return lower;
}