import fs, { PathLike } from "fs";

export const isDirectory = (path: PathLike) => {
  const stat = fs.statSync(path);
  return stat.isDirectory();
};
