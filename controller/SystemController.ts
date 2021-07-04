import master from "../master.ts";

import { Request, Response } from "https://deno.land/x/oak@v7.6.3/mod.ts";

export default class SystemController {
  constructor() {}

  async addObject(
    { request, response }: { request: Request; response: Response },
  ) {
    // Fetch the body parameters
    const body = await request.body();
    const value = await body.value;

    // Propegate the request body to all slaves
    await master.postSystem(value);

    // Unless an error is thrown just return 200 OK
    response.status = 200;
  }
}
