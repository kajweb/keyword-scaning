import { KeywordScaning } from "../src/KeywordScaning";

const keyWords = ["key"];
const folderPath = "test/data/";

const keywordScaning = new KeywordScaning({
  // root: "/Users/glin/code/myproject/",
  root: "/Users/glin/code/myproject/keyword-scaning",
  folderPath,
  keywordList: keyWords,
  log: {
    debug: false,
  },
});

const result = keywordScaning.start();

console.log(result);
