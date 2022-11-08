export type loop = (...data: any[]) => void;

export interface KeyWordScaningConstructorProps extends LoggerProps {
  root?: string;
  /** 检测路径 */
  folderPath: string;
  /** 关键字列表 */
  keywordList: string[];
  /** 忽略的文件列表 */
  // ignoreFolder: string[]
  // whiteExt: string
  log?: LoggerProps;
}

export type initFnConfig = loop | boolean;

export interface LoggerProps {
  info?: initFnConfig;
  debug?: initFnConfig;
  error?: initFnConfig;
  warn?: initFnConfig;
}
