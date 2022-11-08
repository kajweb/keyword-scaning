import { initFnConfig, LoggerProps, loop } from "./utils/typescript";

const loopFn: loop = () => {};

const makeInitFn = (defaultFn: loop, config?: initFnConfig) =>
  typeof config === "function" ? config : config === false ? loopFn : defaultFn;

export class Logger {
  private info: loop;
  private debug: loop;
  private error: loop;
  private warn: loop;

  constructor(args?: LoggerProps) {
    this.info = makeInitFn(console.log, args?.info);
    this.debug = makeInitFn(console.debug, args?.debug);
    this.error = makeInitFn(console.error, args?.error);
    this.warn = makeInitFn(console.error, args?.warn);
  }

  public log = () => ({
    info: this.info,
    debug: this.debug,
    error: this.error,
    warn: this.warn,
  });
}
