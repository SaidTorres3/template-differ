import { createDiffVisualizer } from "./diffVisualizer/createDiffVisualizer";
import { compareTwoDocx } from "./diffGenerator/compareTwoDocx";
import { CreateTemplateOutputDiffVisualizerOpts } from "./types";
export { docxToEditableObjects } from "./docxParser/docxToEditableObjects";
export { editableObjectToDocx } from "./docxParser/editableObjectToDocx";

export const createTemplateOutputDiffVisualizer = (opts: CreateTemplateOutputDiffVisualizerOpts) => {
  compareTwoDocx(opts.templatePath, opts.templateOutputPath).then(diff => {
    createDiffVisualizer({
      diff,
      savePath: opts.savePath,
      dataPath: opts.dataPath
    })
  })
}