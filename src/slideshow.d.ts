declare module 'slideshow' {
  class Slideshow {
    constructor(application: string);

    info(): Promise<info>;
    stat(): Promise<stat>;

    boot(): Promise<string>;
    quit(): Promise<string>;
    last(): Promise<string>;
    prev(): Promise<string>;
    next(): Promise<string>;
    start(): Promise<string>;
    close(): Promise<string>;
    pause(): Promise<string>;
    first(): Promise<string>;
    resume(): Promise<string>;

    open(file: string): Promise<string>;
    goto(index: number): Promise<string>;
  }

  interface info {
    notes: string[];
    titles: string[];
  }

  interface stat {
    state: string;
    slides: number;
    position: number;
  }

  export = Slideshow;
}
