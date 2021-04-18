import { config } from "https://deno.land/x/dotenv/mod.ts";
import { Context } from "https://deno.land/x/oak/mod.ts";

export class RequestError extends Error {
  public statusError: number;
  public description?: string;

  constructor(message: string, statusError: number, description?: string) {
    super(message);
    this.statusError = statusError;
    this.description = description;
  }
}

export const errorHandler = async (
  { response }: Context,
  next: () => Promise<void>,
) => {
  await next().catch((error: RequestError) => {
    response.status = error.statusError;
    response.body = {
      message: error.message,
      stack: config().NODE_ENV == "development" ? error.stack : "🥞",
      description: error.description,
    };
  });
};
