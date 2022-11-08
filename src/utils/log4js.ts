const log4js = require("log4js");

log4js.configure({
  appenders: {
    console: { type: "console" },
    stdout: { type: "stdout", layout: { type: "messagePassThrough" } },
    input: {
      type: "file",
      filename: "data/logs/input.log",
      layout: { type: "messagePassThrough" },
    },
    log: { type: "file", filename: "data/logs/log.log" },
    debug: { type: "file", filename: "data/logs/debug.log" },
  },
  categories: {
    default: { appenders: ["console", "stdout", "log"], level: "all" },
    send: { appenders: ["stdout", "log"], level: "all" },
    debug: { appenders: ["debug", "log"], level: "all" },
    input: { appenders: ["log", "input"], level: "all" },
  },
});

/** 输出到 stdout、log */
const logger = log4js.getLogger("send");
/** 输出到 debug、log */
const logDebugger = log4js.getLogger("debug");
/** 记录input数据 */
const logInputer = log4js.getLogger("input");

export { logger, logInputer, logDebugger };
