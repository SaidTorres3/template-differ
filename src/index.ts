import { createDiffVisualizer } from "./diffVisualizer/createDiffVisualizer";
import { compareTwoDocx } from "./diffGenerator/compareTwoDocx";

compareTwoDocx("src/out.docx", "src/template.docx").then(diff => {
  createDiffVisualizer({
    diff,
    savePath: 'src/diffVisualizer.html',
    dataPath: 'src/data.json'
  })
})