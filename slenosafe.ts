import Sleno from "../Sleno/index.ts";
import { Info, Stat } from "https://deno.land/x/sleno@2.0.0/types.ts";

class Slenosafe {
  private sleno = new Sleno("PowerPoint");
  private interval = 30;
  private playing = false;

  public info?: Info;
  public stat?: Stat;
  public timer?: number;

  async initializeSleno() {
    await this.sleno.boot().catch((error) => {
      // Since the application is already running we can just log it
      if (error === "Application is already running") console.log(error);
      // Stop the application if anything else if thrown
      else throw new Error(error);
    });
  }

  async loadFile(file: string) {
    await this.sleno.open(file).catch(async (error) => {
      if (error === "There is already a presentation loaded") {
        // Close the previous presentation and reattempt opening the presentation file
        await this.sleno.close();
        await this.sleno.open(file);
      } // Stop the application if anything else if thrown
      else throw new Error(error);
    });

    // Start the presentation
    await this.sleno.start();

    this.info = await this.sleno.info();
    this.stat = await this.sleno.stat();
  }

  setPosition(position: number) {
    return this.sleno.goto(position);
  }

  setInterval(interval: number) {
    this.interval = interval;

    if (this.playing) {
      // Clear the previous interval and start a new one
      clearInterval(this.timer);
      this.timer = setInterval(
        this.intervalFunction.bind(this),
        this.interval * 1000,
      );
    }
  }

  setPlaying(playing: boolean) {
    if (playing && !this.playing) {
      this.timer = setInterval(
        this.intervalFunction.bind(this),
        this.interval * 1000,
      );
    } else if (!playing && this.playing) clearInterval(this.timer);
  }

  private async intervalFunction() {
    // const stat = await this.sleno.stat();
    // console.log(stat.position);

    // await this.sleno.next();
  }
}
 
export default new Slenosafe();