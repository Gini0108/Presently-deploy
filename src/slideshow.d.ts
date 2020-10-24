// This should defenitly be refactored

declare module 'slideshow' {
  interface info {
    titles: string[];
    notes: string[];
  }

  class Slideshow {
    constructor(program: string);

    boot(): void;
    stat(): Promise<any>;
    next(): Promise<any>;
    info(): Promise<info>;
    open(filename: string): Promise<any>;
    goto(index: number): Promise<any>;
    start(): Promise<any>;
    close(): Promise<any>;
    slider(): Promise<any>;
  }

  export = Slideshow;
}
