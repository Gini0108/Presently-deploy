import Master from "../master.ts";

import { Request, Response } from "https://deno.land/x/oak@v7.6.3/mod.ts";

export default class SystemController {
  private master: Master;

  constructor() {
    this.master = new Master();
    this.master.initialize();
  }

  async addObject(
    { request, response }: { request: Request; response: Response },
  ) {
    // Fetch the body parameters
    const body = await request.body();
    const value = await body.value;

    this.master.propagate(value);

    response.status = 200;
  }
}