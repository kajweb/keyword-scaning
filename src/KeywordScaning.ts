import fs, { PathLike } from "fs";
import path from "path";
// import path from "path";
import { Logger } from "./Logger";
import { isDirectory } from "./utils/helper";
import { KeyWordScaningConstructorProps } from "./utils/typescript";

export class KeywordScaning extends Logger {
  /** 根目录 */
  public root: string = ".";

  /** 当前是否已经运行 */
  public isLock: boolean = false;

  /** 检测路径 */
  public folderPath: string = ".";

  /** 关键字列表 */
  public keywordList: string[];

  /** 打开文件的编码 */
  private encode: BufferEncoding = "utf-8";

  /** 开始时间 */
  private startTime: Date | undefined;

  /** 结束时间 */
  private endTime: Date | undefined;

  /** 待扫描文件列表 */
  private filesList: string[] = [];

  /** 跳过扫描的文件列表 */
  private skipfilesList: string[] = [];

  /** 存在关键字的文件列表 */
  private keyFileList: Set<string> = new Set();

  public pushSingleFile = (...items: typeof this.filesList) =>
    this.filesList.push(...items);

  /** 初始化类 */
  constructor(args: KeyWordScaningConstructorProps) {
    super(args.log);
    const { root, folderPath, keywordList } = args;
    if (root) this.root = root;
    if (folderPath) this.folderPath = folderPath;
    this.keywordList = keywordList;
  }

  /** 开启扫描进程 */
  private startProcess() {
    this.isLock = true;
    this.startTime = new Date();
  }

  /** 关闭扫描进程 */
  private endProcess() {
    this.isLock = false;
    this.endTime = new Date();
  }

  /** 检查路径是否存在 */
  public checkPath(dir: string) {
    return fs.existsSync(dir);
  }

  /** 清空列表 */
  public initProcess() {
    this.filesList = [];
    this.skipfilesList = [];
    this.keyFileList.clear();
  }

  /** 开始执行 */
  public start() {
    if (!this.checkPath(path.join(this.root, this.folderPath)))
      return this.log().error(
        `搜索路径不存在，进程终止: ${this.root} ${this.folderPath}`
      );

    this.log().info("开始扫描");
    if (this.isLock) {
      this.log().error("当前已经执行");
      return false;
    }
    this.startProcess();
    this.mainProcess();
    this.endProcess();
    return this.genResult();
  }

  /** 显示执行时间 */
  private showTime = () => {
    const timems = this.calcTime();
    this.log().info("执行完成");
    this.log().info(`执行时间：${timems / 1000}秒`);
    return timems;
  };

  /** 计算运行时间 */
  private calcTime(): number {
    if (!this.endTime || !this.startTime) return 0;
    return this.endTime.getTime() - this.startTime.getTime();
  }

  /** 主进程 */
  private mainProcess() {
    if (isDirectory(path.join(this.root, this.folderPath))) {
      this.scaneDirectory();
    } else {
      this.log().warn(`单文件模式: ${this.folderPath}`);
      this.pushSingleFile(this.folderPath);
    }
    this.scaneFiles();
  }

  /** 扫描文件列表 */
  private scaneDirectory() {
    this.log().info("扫描文件列表（可能需要较长的时间）");
    this.getFileLists(this.root, this.folderPath);
    this.log().info(`共扫描${this.filesList.length}个文件`);
    this.log().info(`跳过扫描${this.skipfilesList.length}个文件`);
  }

  /** 检查文件列表 */
  private getFileLists(root: string, src: string) {
    const files = fs.readdirSync(path.join(root, src));
    files.forEach((file) => {
      // @todo 白名单目录
      const fileSrc: PathLike = path.join(src, file);
      if (isDirectory(path.join(root, fileSrc))) {
        this.getFileLists(root, fileSrc);
      } else {
        // @todo 白名单后缀 / 规则
        this.pushSingleFile(fileSrc);
      }
    });
  }

  /** 读取文件 */
  private scaneFiles(): void {
    this.filesList.forEach((file) => {
      this.scaneFile(file);
    });
  }

  private scaneFile(file: string) {
    let isExits: boolean = false;
    const fileContent = fs.readFileSync(
      path.join(this.root, file),
      this.encode
    );
    for (let i = 0; i < this.keywordList.length; i++) {
      if (fileContent.includes(this.keywordList[i])) {
        this.log().info(`存在关键字：${file} ${this.keywordList[i]}`);
        this.keyFileList.add(file);
        isExits = true;
      }
    }
    if (!isExits) {
      this.log().debug(`不存在关键字：${file}`);
    }
  }

  private genResult() {
    const timeMs = this.showTime();

    return {
      /** 运行时间 */
      time: timeMs,
      /** 检测文件数量 */
      fileCount: this.filesList.length,
      /** 跳过文件数量 */
      skipCount: this.skipfilesList.length,
      /** 总文件数量 */
      allCount: this.skipfilesList.length + this.filesList.length,
      /** todo 检测关键字数量 */
      keyWordCount: null,
      /** 关键字数量 */
      keyFileCount: this.keyFileList.size,
      /** 文件列表 */
      keyFileList: [...this.keyFileList],
    };
  }
}
