# keyword-scaning 

> Keyword to search for code 

## USAGE 

```typescript
const keywordScaning = new KeywordScaning({
  root: ".",
  folderPath: '.',
  keywordList: ["test"],
  log: {
    debug: false,
  },
});

const result = keywordScaning.start();

console.log(result);
```